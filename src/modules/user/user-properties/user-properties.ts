import { DateTime, Time } from '../../../framework/util/time';
import * as moment from 'moment';

export interface UserPropertiesEntityParams {
  selectedDate?: Date;
}
export class UserProperties {
  public get selectedDate(): DateTime {
    return this._selectedDate;
  }

  public set selectedDate(value: Date | DateTime) {
    this._selectedDate = moment(value);
  }

  private _selectedDate: DateTime;

  constructor(params?: UserPropertiesEntityParams) {
    this._selectedDate = moment(params?.selectedDate) || Time.get();
  }

  public toJSON(): Required<UserPropertiesEntityParams> {
    return {
      selectedDate: this.selectedDate.toDate(),
    };
  }
}
