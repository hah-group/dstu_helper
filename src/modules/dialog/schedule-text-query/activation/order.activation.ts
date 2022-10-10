import { OrderDefinition } from './definition/order-definition';

export const ORDER_LESSON_ACTIVATION = new RegExp(
  `^(какая|где|\\d|${OrderDefinition}) (\\d|${OrderDefinition}) (пара|какая|где)`,
  'gi',
);
