export const WeekdayGenDefinition = {
  1: 'понедельник',
  2: 'вторник',
  3: 'среду',
  4: 'четверг',
  5: 'пятницу',
  6: 'субботу',
  7: 'воскресенье',
};
export const WeekdayShortDefinition = {
  1: 'пн',
  2: 'вт',
  3: 'ср',
  4: 'чт',
  5: 'пт',
  6: 'сб',
  7: 'вс',
};

export type WeekdayNumbers = keyof typeof WeekdayGenDefinition;
