import { Injectable, Logger } from '@nestjs/common';
import { ScheduleProviderBuilder } from './schedule-provider.builder';
import { ScheduleProvider } from './schedule.provider';
import { GroupRepository } from '../group/group.repository';
import { GroupEntity } from '../group/group.entity';
import { UniversityRepository } from '../university/university.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import * as lodash from 'lodash';
import { TeacherRepository } from '../teacher/teacher.repository';
import { UniversityEntity } from '../university/university.entity';
import { GroupStatus } from '../group/group-status.enum';

@Injectable()
export class ScheduleService {
  private readonly log = new Logger('ScheduleService');

  constructor(
    private readonly scheduleProviderBuilder: ScheduleProviderBuilder,
    private readonly groupRepository: GroupRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly universityRepository: UniversityRepository,
  ) {}

  public async updateSchedule(providerName?: string, groupId?: number): Promise<any> {
    const providers = this.getProviders(providerName);
    this.log.log(`Update schedule for providers ${providers.length}`);

    const startTime = Date.now();
    for (const provider of providers) {
      const providerGroups = await this.getGroups(provider.name, groupId);

      for (const providerGroup of providerGroups) {
        providerGroup.status = GroupStatus.IN_PROGRESS;
        await this.groupRepository.save(providerGroup);

        this.log.log(`Update schedule for group ${providerGroup.name}`);
        const scheduleStartTime = Date.now();
        try {
          const schedule = await provider.getSchedule(providerGroup);
          if (!schedule) {
            this.log.log(`No changes, last updated at: ${providerGroup.lastUpdateAt?.toString() || 'never'}`);
            providerGroup.status = GroupStatus.READY;
            continue;
          }

          this.log.log(`Collected ${schedule.lessons.length} lessons, saving`);

          if (schedule.withErrors) providerGroup.status = GroupStatus.WITH_ERRORS;
          else providerGroup.status = GroupStatus.READY;
          providerGroup.lastUpdateAt = schedule.lastUpdatedAt.toDate();

          await this.teacherRepository.upsertMany(schedule.teachers);
          await this.lessonRepository.upsertMany(schedule.lessons);
          this.log.log(`Schedule updated (${(Date.now() - scheduleStartTime) / 1000} s)`);
        } catch (e) {
          providerGroup.status = GroupStatus.WITH_ERRORS;
        } finally {
          await this.groupRepository.save(providerGroup);
        }
      }
    }

    this.log.log(`Schedule updated (${(Date.now() - startTime) / 1000} s)`);
  }

  public async findGroup(query: string, providerName: string): Promise<GroupEntity | null> {
    const [provider] = this.getProviders(providerName);
    this.log.log(`Finding group by query: ${query} (${provider.name})`);

    const groupInfo = await provider.findGroup(query);
    if (groupInfo) {
      this.log.log(`Found group: ${groupInfo.id} (${provider.name})`);
      let group = await this.groupRepository.getById(provider.name, groupInfo.id);
      if (group) return group;

      this.log.log(`Create new group: ${groupInfo.id} (${provider.name})`);
      const university = <UniversityEntity>await this.universityRepository.getByName(providerName);
      group = new GroupEntity();
      group.university = university;
      group.externalId = groupInfo.id;
      group.name = groupInfo.name;

      await this.groupRepository.save(group);
      return group;
    }

    this.log.log(`Group not found by query: ${query} (${provider.name})`);

    return null;
  }

  private getProviders(providerName?: string): ScheduleProvider[] {
    if (providerName) return [this.scheduleProviderBuilder.build(providerName)];
    else return this.scheduleProviderBuilder.buildAll();
  }

  private async getGroups(providerName: string, groupId?: number): Promise<GroupEntity[]> {
    if (groupId) return lodash.compact([await this.groupRepository.getById(providerName, groupId)]);
    else return this.groupRepository.getAllForUniversity(providerName);
  }
}
