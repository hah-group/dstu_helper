import { Injectable } from '@nestjs/common';
import { ScheduleProviderService } from '../schedule-provider/schedule-provider.service';
import { GroupRepository } from '../group/group.repository';
import { lodash, Time } from '@dstu_helper/common';
import { LessonRepository } from '../lesson/lesson.repository';
import { GroupStatus } from '../group/group-status.enum';
import { FacultyRepository } from '../faculty/faculty.repository';

export const GROUP_CHUNK_SIZE = 50;

@Injectable()
export class ScheduleCacheService {
  constructor(
    private readonly scheduleProviderService: ScheduleProviderService,
    private readonly groupRepository: GroupRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly facultyRepository: FacultyRepository,
  ) {}

  public async updateGroupList(): Promise<void> {
    const existGroups = await this.groupRepository.findAll();
    const existFaculties = await this.facultyRepository.findAll();
    const existFaculty = lodash.uniqBy(existFaculties, (record) => record.externalId);

    const groups = await this.scheduleProviderService.mergeGroupList(existGroups, existFaculty);
    const groupFaculties = lodash.uniqBy(
      groups.map((record) => record.faculty),
      (record) => record.externalId,
    );

    const facultiesToCreate = lodash.differenceBy(groupFaculties, existFaculty, (record) => record.externalId);
    await this.facultyRepository.save(facultiesToCreate);

    const groupFacultiesMap = lodash.keyBy(groupFaculties, (record) => record.externalId);
    groups
      .filter((record) => !record.faculty.isSaved)
      .forEach((record) => {
        record.faculty = groupFacultiesMap[record.faculty.externalId];
      });

    const groupsToDelete = lodash.differenceBy(existGroups, groups, (record) => record.externalId);
    await this.groupRepository.delete(groupsToDelete);

    await this.groupRepository.save(groups);
  }

  public async updateSchedule(): Promise<void> {
    const startTime = Time.get().subtract(1, 'w').startOf('w');
    const groups = await this.groupRepository.findAll();

    const chunks = lodash.chunk(groups, GROUP_CHUNK_SIZE);
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (group) => {
          group.status = GroupStatus.IN_PROGRESS;
          await this.groupRepository.save(group);

          const existLessons = await group.getLessons();
          try {
            const resultLessons = await this.scheduleProviderService.getSchedule(existLessons, group, startTime);
            await this.lessonRepository.save(resultLessons);
            group.status = GroupStatus.READY;
          } catch (e) {
            console.error(e);
            group.status = GroupStatus.WITH_ERRORS;
          } finally {
            await this.groupRepository.save(group);
          }
        }),
      );
    }
  }
}
