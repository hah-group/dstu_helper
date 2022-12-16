import { Injectable } from '@nestjs/common';
import { ScheduleProviderService } from '../schedule-provider/schedule-provider.service';
import { GroupRepository } from '../group/group.repository';
import { lodash, Time } from '@dstu_helper/common';
import { LessonRepository } from '../lesson/lesson.repository';
import { GroupStatus } from '../group/group-status.enum';

export const GROUP_CHUNK_SIZE = 50;

@Injectable()
export class ScheduleCacheService {
  constructor(
    private readonly scheduleProviderService: ScheduleProviderService,
    private readonly groupRepository: GroupRepository,
    private readonly lessonRepository: LessonRepository,
  ) {}

  public async updateGroupList(): Promise<void> {
    const existGroups = await this.groupRepository.findAll();

    const groups = await this.scheduleProviderService.getGroupList(existGroups);
    /*const t = lodash.groupBy(groups, (group) => group.faculty.externalId);
    Object.keys(t).map((rec) => {
      if (t[rec].length > 1) console.log(t[rec]);
    });
*/
    /*const groupsToDelete = lodash.differenceBy(existGroups, groups, (record) => record.externalId);
    await this.groupRepository.deleteMany(groupsToDelete);*/

    await this.groupRepository.upsert(groups);
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
