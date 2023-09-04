import { FilterConditionValue } from '../../../user/filter/user-property.filter-decorator';

export const SettingsStageConditionFilter: FilterConditionValue = (value) => {
  if (typeof value == 'string') {
    const path = value.split('.');
    return path[0] == 'settings' && path.length >= 1;
  }
  return false;
};
