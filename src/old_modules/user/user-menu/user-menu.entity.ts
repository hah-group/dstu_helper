import { DayScheduleFields, DayScheduleSection } from './day-schedule-section.user-menu';

export interface UserMenuFields {
  daySchedule?: DayScheduleFields;
}

export class UserMenu {
  constructor(fields?: UserMenuFields) {
    this._daySchedule = new DayScheduleSection(fields?.daySchedule);
  }

  private _daySchedule: DayScheduleSection;

  public get daySchedule(): DayScheduleSection {
    return this._daySchedule;
  }

  public toObject(): UserMenuFields {
    return {
      daySchedule: this._daySchedule.toObject(),
    };
  }
}
