import { Injectable } from '@nestjs/common';
import { ScheduleProviderService } from '../schedule-provider/schedule-provider.service';
import { GroupRepository } from '../group/group.repository';
import { lodash, Time } from '@dstu_helper/common';
import { LessonRepository } from '../lesson/lesson.repository';
import { GroupStatus } from '../group/group-status.enum';
import { FacultyRepository } from '../faculty/faculty.repository';
import { TeacherRepository } from '../teacher/teacher.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { AudienceRepository } from '../audience/audience.repository';
import { TeacherEntity } from '../teacher/teacher.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { AudienceEntity } from '../audience/audience.entity';

export const GROUP_CHUNK_SIZE = 1;

@Injectable()
export class ScheduleCacheService {
  constructor(
    private readonly scheduleProviderService: ScheduleProviderService,
    private readonly groupRepository: GroupRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly facultyRepository: FacultyRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly audienceRepository: AudienceRepository,
  ) {}

  public async updateGroupList(): Promise<void> {
    const existGroups = await this.groupRepository.findAll();
    const existFaculties = await this.facultyRepository.findAll();

    const groups = await this.scheduleProviderService.mergeGroupList(existGroups, existFaculties);
    const groupFaculties = lodash.uniqBy(
      groups.map((record) => record.faculty),
      (record) => record.externalId,
    );

    const facultiesToCreate = lodash.differenceBy(groupFaculties, existFaculties, (record) => record.externalId);
    await this.facultyRepository.save(facultiesToCreate);

    const groupFacultiesMap = lodash.keyBy(groupFaculties, (record) => record.externalId);
    groups
      .filter((record) => !record.faculty.isSaved)
      .forEach((record) => {
        record.faculty.id = groupFacultiesMap[record.faculty.externalId].id;
      });

    const groupsToDelete = lodash.differenceBy(existGroups, groups, (record) => record.externalId);
    await this.groupRepository.delete(groupsToDelete);

    await this.groupRepository.save(groups);
  }

  public async updateSchedule(): Promise<void> {
    const startedTime = Date.now();
    const startTime = Time.get().subtract(1, 'w').startOf('w');
    const [groups, existTeachers, existSubjects, existAudience] = await Promise.all([
      this.groupRepository.findAll(),
      this.teacherRepository.findAll(),
      this.subjectRepository.findAll(),
      this.audienceRepository.findAll(),
    ]);

    const chunks = lodash.chunk(groups, GROUP_CHUNK_SIZE);
    let i = 0;
    for (const chunk of chunks) {
      console.log(``);
      console.log(``);
      console.log(`Processing chunk ${i + 1} of ${chunks.length}`);
      console.log(`=============================================`);
      console.log(``);
      const existTeachersMap = lodash.keyBy(existTeachers, 'externalId');
      const existSubjectsMap = lodash.keyBy(existSubjects, 'name');
      const existAudienceMap = lodash.keyBy(existAudience, (record) => record.uniqueId);

      await Promise.all(
        chunk.map(async (group) => {
          const existLessons = await this.lessonRepository.getFromDate(startTime, group);
          try {
            const mergeScheduleResult = await this.scheduleProviderService.mergeSchedule(
              {
                existLessons: existLessons,
                existTeacherMap: existTeachersMap,
                existSubjectMap: existSubjectsMap,
                existAudienceMap: existAudienceMap,
              },
              group,
              startTime,
            );

            const teachersToCreate = lodash.differenceBy(
              Array.from(mergeScheduleResult.teachers.values()),
              existTeachers,
              'externalId',
            );
            const subjectsToCreate = lodash.differenceBy(
              Array.from(mergeScheduleResult.subjects.values()),
              existSubjects,
              'name',
            );
            const audiencesToCreate = lodash.differenceBy(
              Array.from(mergeScheduleResult.audiences.values()),
              existAudience,
              (record) => record.uniqueId,
            );

            await Promise.all([
              this.teacherRepository.upsert(teachersToCreate),
              this.subjectRepository.upsert(subjectsToCreate),
              this.audienceRepository.upsert(audiencesToCreate),
            ]);

            existTeachers.push(...teachersToCreate);
            existSubjects.push(...subjectsToCreate);
            existAudience.push(...audiencesToCreate);

            mergeScheduleResult.lessons.forEach((record) => {
              const teacher = <TeacherEntity>(
                mergeScheduleResult.teachers.get((<TeacherEntity>record.teacher).externalId)
              );
              (<TeacherEntity>record.teacher).id = teacher.id;

              const subject = <SubjectEntity>mergeScheduleResult.subjects.get(record.subject.name);
              record.subject.id = subject.id;

              if (record.audience) {
                const audience = <AudienceEntity>mergeScheduleResult.audiences.get(record.audience.uniqueId);
                record.audience.id = audience.id;
              }
            });

            const lessonsToDelete = lodash.differenceBy(
              existLessons,
              mergeScheduleResult.lessons,
              (record) => record.uniqueId,
            );
            await this.lessonRepository.delete(lessonsToDelete);

            await this.lessonRepository.upsert(mergeScheduleResult.lessons);
          } catch (e) {
            console.error(e);
            group.status = GroupStatus.WITH_ERRORS;
            await this.groupRepository.save(group);
          }
        }),
      );
      i += 1;
      console.log(`=============================================`);
      console.log(`Chunk ${i} of ${chunks.length} processed`);
    }
    console.log(`Schedule collected (${Date.now() - startedTime} ms)`);
  }
}
