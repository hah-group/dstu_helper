import { Schedule, StudyGroup } from '@prisma/client';

export type GroupWithScheduleFullType = Omit<StudyGroup, 'id'> & {
  Schedule: Omit<Schedule, 'id' | 'groupId' | 'updateAt'>[];
};
