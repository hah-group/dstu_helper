import * as moment from 'moment';
import { LessonTypeDefinition } from './lesson-type.definition';
import { LessonType } from '@prisma/client';

export default class DstuLessonParser {
  public static subjectParse(subject: string): { type: LessonType; name: string; subgroup?: number } | undefined {
    const regex = new RegExp(/(лек|лаб|пр)\.? (?!Учебно-тренировочный)(.*?)(?:, п\/г (\d)|$)/gi);
    const match = regex.exec(subject);
    if (match && match.length > 3)
      return {
        type: LessonTypeDefinition[match[1]],
        name: match[2].replace(/ \(.*\)/gi, ''),
        subgroup: match[3] ? parseInt(match[3]) : undefined,
      };
  }

  public static classRoomParse(
    classRoom: string,
  ): { corpus: string; classRoom: string; distance: boolean } | undefined {
    const regex = new RegExp(/^([1-9]\d?)-(\d{3})$/gi);
    const match = regex.exec(classRoom);

    if (match && match.length > 2)
      return {
        corpus: match[1],
        classRoom: match[2],
        distance: false,
      };
  }

  public static dateParser(date: string): Date {
    return moment(date).toDate();
  }

  /* private static isCurrent(dateStart: Date, dateEnd: Date): boolean {
    const currentDate = new Date().getTime() + 10800000;
    if (currentDate <= dateEnd.getTime() && currentDate >= dateStart.getTime())
      return true;
    else if (
      currentDate + 900000 <= dateEnd.getTime() &&
      currentDate + 900000 >= dateStart.getTime()
    )
      return true;
    return false;
  }

  private static isStarted(dateStart: Date, dateEnd: Date): boolean {
    const currentDate = new Date().getTime() + 10800000;
    return (
      currentDate <= dateEnd.getTime() && currentDate >= dateStart.getTime()
    );
  }*/
}
