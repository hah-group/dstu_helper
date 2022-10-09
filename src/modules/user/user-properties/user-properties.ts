import { DateTime, Time } from '../../../framework/util/time';
import * as moment from 'moment';

export interface UserPropertiesEntityParams {
  selectedDate?: Date;
}

export class UserProperties {
  constructor(params?: UserPropertiesEntityParams) {
    this._selectedDate = moment(params?.selectedDate) || Time.get();
  }

  private _selectedDate: DateTime;

  public get selectedDate(): DateTime {
    return this._selectedDate;
  }

  public set selectedDate(value: Date | DateTime) {
    this._selectedDate = moment(value);
  }

  public toJSON(): Required<UserPropertiesEntityParams> {
    return {
      selectedDate: this.selectedDate.toDate(),
    };
  }
}
