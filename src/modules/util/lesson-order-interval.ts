import { Time } from './time';

export const lessonOrderInterval = [
  {
    order: 1,
    start: Time.get().hour(8).minute(30),
    end: Time.get().hour(10).minute(5),
  },
  {
    order: 2,
    start: Time.get().hour(10).minute(15),
    end: Time.get().hour(11).minute(50),
  },
  {
    order: 3,
    start: Time.get().hour(12).minute(0),
    end: Time.get().hour(13).minute(35),
  },
  {
    order: 4,
    start: Time.get().hour(14).minute(15),
    end: Time.get().hour(15).minute(50),
  },
  {
    order: 5,
    start: Time.get().hour(16).minute(0),
    end: Time.get().hour(17).minute(35),
  },
  {
    order: 6,
    start: Time.get().hour(17).minute(45),
    end: Time.get().hour(19).minute(20),
  },
  {
    order: 7,
    start: Time.get().hour(19).minute(30),
    end: Time.get().hour(21).minute(5),
  },
];
