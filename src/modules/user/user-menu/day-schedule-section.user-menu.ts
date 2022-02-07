import { UserMenuSectionBase } from './user-menu-section.base';

export interface DayScheduleFields {
  offset?: number;
}

export class DayScheduleSection extends UserMenuSectionBase<DayScheduleFields> implements DayScheduleFields {
  constructor(params?: DayScheduleFields) {
    super();
    this._offset = params?.offset || 0;
  }

  private _offset: number;

  public get offset(): number {
    return this._offset;
  }

  public today(): number {
    this._offset = 0;
    return this._offset;
  }

  public nextDay(): number {
    this._offset += 1;
    return this._offset;
  }

  public previousDay(): number {
    this._offset -= 1;
    return this._offset;
  }

  public nextWeek(): number {
    this._offset += 7;
    return this._offset;
  }

  public previousWeek(): number {
    this._offset -= 7;
    return this._offset;
  }

  public reset(): void {
    this._offset = 0;
  }

  public toObject(): DayScheduleFields {
    return {
      offset: this._offset,
    };
  }
}
