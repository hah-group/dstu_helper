import { PropertiesContainerBase } from '@dstu_helper/common';
import { TimeIntervalProperty, TimeIntervalPropertyType } from './time-interval.property';

export interface NotificationPropertiesData {
  targetTime?: TimeIntervalPropertyType;
}

export class NotificationProperties extends PropertiesContainerBase<NotificationPropertiesData> {
  public targetTime: TimeIntervalProperty;

  constructor(data?: NotificationPropertiesData) {
    super();
    this.targetTime = new TimeIntervalProperty('targetTime', data?.targetTime);
  }

  public render(): NotificationPropertiesData {
    return {
      targetTime: this.targetTime.render(),
    };
  }
}
