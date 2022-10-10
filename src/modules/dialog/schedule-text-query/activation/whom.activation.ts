import { OnMessageFunction } from '../../../../framework/bot/decorator/on-message.decorator';
import { IsBanWordExist } from './definition/ban-definition';

export const WHOM_ACTIVATION = /(.*какие (завтра|послезавтра)? (пары).*|пары.*?какие)/gi;

export const WhomActivation: OnMessageFunction = (message: string) =>
  !IsBanWordExist(message) && !!message.match(WHOM_ACTIVATION);
