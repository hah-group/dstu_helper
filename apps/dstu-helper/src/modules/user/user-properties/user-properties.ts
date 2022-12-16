import { Moment, Time } from '@dstu_helper/common';

export interface UserPropertiesEntityParams {
  selectedDate?: Date;
}

export class UserProperties {
  constructor(params?: UserPropertiesEntityParams) {
    this._selectedDate = Moment(params?.selectedDate) || Time.get();
  }

  private _selectedDate: DateTime;

  public get selectedDate(): DateTime {
    return this._selectedDate;
  }

  public set selectedDate(value: Date | DateTime) {
    this._selectedDate = Moment(value);
  }

  public toJSON(): Required<UserPropertiesEntityParams> {
    return {
      selectedDate: this.selectedDate.toDate(),
    };
  }
}
