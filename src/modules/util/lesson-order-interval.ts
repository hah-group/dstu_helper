import { Time } from './time';

export const lessonOrderInterval = [
  {
    order: 1,
    start: Time.get().hour(8).minute(30).second(0),
    end: Time.get().hour(10).minute(5).second(0),
  },
  {
    order: 2,
    start: Time.get().hour(10).minute(15).second(0),
    end: Time.get().hour(11).minute(50).second(0),
  },
  {
    order: 3,
    start: Time.get().hour(12).minute(0).second(0),
    end: Time.get().hour(13).minute(35).second(0),
  },
  {
    order: 4,
    start: Time.get().hour(14).minute(15).second(0),
    end: Time.get().hour(15).minute(50).second(0),
  },
  {
    order: 5,
    start: Time.get().hour(16).minute(0).second(0),
    end: Time.get().hour(17).minute(35).second(0),
  },
  {
    order: 6,
    start: Time.get().hour(17).minute(45).second(0),
    end: Time.get().hour(19).minute(20).second(0),
  },
  {
    order: 7,
    start: Time.get().hour(19).minute(30).second(0),
    end: Time.get().hour(21).minute(5).second(0),
  },
];
