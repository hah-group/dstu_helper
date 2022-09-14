import { Injectable, Logger } from '@nestjs/common';
import { ScheduleProviderBuilder } from './schedule-provider.builder';
import { ScheduleProvider } from './schedule.provider';
import { GroupRepository } from '../group/group.repository';
import { GroupEntity } from '../group/group.entity';
import { UniversityRepository } from '../university/university.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import * as lodash from 'lodash';
import { TeacherRepository } from '../teacher/teacher.repository';

@Injectable()
export class ScheduleService {
  private readonly log = new Logger('ScheduleService');
  constructor(
    private readonly scheduleProviderBuilder: ScheduleProviderBuilder,
    private readonly groupRepository: GroupRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly teacherRepository: TeacherRepository,
  ) {}

  public async updateSchedule(providerName?: string, groupId?: number): Promise<any> {
    const providers = this.getProviders(providerName);
    this.log.log(`Update schedule for providers ${providers.length}`);

    const startTime = Date.now();
    for (const provider of providers) {
      const providerGroups = await this.getGroups(provider.name, groupId);

      for (const providerGroup of providerGroups) {
        this.log.log(`Update schedule for group ${providerGroup.name}`);
        const scheduleStartTime = Date.now();
        const schedule = await provider.getSchedule(providerGroup);
        if (!schedule) {
          this.log.log(`No changes, last updated at: ${providerGroup.lastUpdateAt.toString()}`);
          continue;
        }

        this.log.log(`Collected ${schedule.lessons.length} lessons, saving`);

        providerGroup.lastUpdateAt = schedule.lastUpdatedAt.toDate();
        await this.teacherRepository.upsertMany(schedule.teachers);
        await this.lessonRepository.upsertMany(schedule.lessons);
        this.log.log(`Schedule updated (${(Date.now() - scheduleStartTime) / 1000} s)`);
      }
    }

    this.log.log(`Schedule updated (${(Date.now() - startTime) / 1000} s)`);
  }

  public getProviders(providerName?: string): ScheduleProvider[] {
    if (providerName) return [this.scheduleProviderBuilder.build(providerName)];
    else return this.scheduleProviderBuilder.buildAll();
  }

  public async getGroups(providerName: string, groupId?: number): Promise<GroupEntity[]> {
    if (groupId) return [await this.groupRepository.getById(providerName, groupId)];
    else return this.groupRepository.getAllForUniversity(providerName);
  }
}
