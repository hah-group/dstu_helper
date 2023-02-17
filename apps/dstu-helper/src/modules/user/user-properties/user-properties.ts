import { DateProperty, PropertiesContainerBase, StringPathProperty, Time } from '@dstu_helper/common';
import { Appearance, AppearanceProperty } from './appearance.property';

export interface UserPropertiesEntityParams {
  selectedDate?: Date;
  inputStage?: string;
  appearance?: Appearance;
}

export class UserProperties extends PropertiesContainerBase<UserPropertiesEntityParams> {
  public readonly selectedDate: DateProperty;
  public readonly inputStage: StringPathProperty;
  public readonly appearance: AppearanceProperty;

  constructor(params?: UserPropertiesEntityParams) {
    super();
    this.selectedDate = new DateProperty('selectedDate', params?.selectedDate || Time.get());
    this.inputStage = new StringPathProperty('inputStage', 'default', params?.inputStage);
    this.appearance = new AppearanceProperty('appearance', params?.appearance);
  }

  public render(): Required<UserPropertiesEntityParams> {
    return {
      selectedDate: this.selectedDate.render(),
      inputStage: this.inputStage.render(),
      appearance: this.appearance.render(),
    };
  }
}
