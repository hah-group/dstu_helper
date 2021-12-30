import * as moment from 'moment';
import { LessonTypeDefinition } from './lesson-type.definition';
import { LessonType } from '@prisma/client';
import { pretties } from './subject-prettier';
import * as str from 'string';
import { TeacherArgs } from '../teacher/teacher.entity';

const SUBJECT_WITHOUT_BRACKETS = /(лек|лаб|пр|зач|экз)\.? ([а-яa-z\-. ,:\/\d]+?)(?:, п\/г (\d)|$)/i;
const SUBJECT_WITH_BRACKETS = /(лек|лаб|пр|зач|экз)\.? ([а-яa-z\-. ,:\/\d]+?) ?\((.*?)\)$/i;

export interface SubjectParsed {
  type: LessonType;
  name: string;
  subgroup?: number;
  subsection?: string;
}

export default class DstuLessonParser {
  public static subjectParse(subject: string): SubjectParsed | undefined {
    let regex;
    const isBracketsExist = subject.indexOf('(') > -1;
    if (isBracketsExist && subject.indexOf(')') < 0) subject += ')';

    if (isBracketsExist) regex = new RegExp(SUBJECT_WITH_BRACKETS);
    else regex = new RegExp(SUBJECT_WITHOUT_BRACKETS);

    const match = subject.match(regex);

    if (match && match.length > 3) {
      const pretty = this.subjectPrettier(subject, match);
      const result: SubjectParsed = {
        type: LessonTypeDefinition[match[1]],
        name: match[2],
      };

      if (!isBracketsExist) result.subgroup = match[3] ? parseInt(match[3]) : undefined;
      else result.subsection = match[3] ? match[3] : undefined;

      return pretty ? pretty : result;
    }
  }

  private static subjectPrettier(subject: string, match: RegExpMatchArray): SubjectParsed | undefined {
    for (const pretty of pretties) {
      if (!subject.match(pretty.regex)) continue;

      const prettyResult = pretty.handler(subject, match);
      if (prettyResult && prettyResult.type && prettyResult.name) return prettyResult;
      return undefined;
    }
  }

  public static classRoomParse(
    classRoom: string,
  ): { corpus?: string; classRoom?: string; distance: boolean } | undefined {
    const match = classRoom.match(/^(\d+)-(\d+[а-я]?)$/i);
    const matchDistance = !!classRoom.match(/ДО/i);

    if (matchDistance) return { distance: true };
    if (match && match.length > 2) {
      let corpus = match[1];
      corpus = corpus.replace(/^0(?<nonZero>\d+)/, '$<nonZero>');
      return {
        corpus: corpus,
        classRoom: match[2],
        distance: false,
      };
    }

    let clearText = classRoom;
    clearText = clearText.replace('.', ' ');
    if (clearText.match(/,[а-я\d]/i)) clearText = clearText.replace(',', ', ');
    clearText = str(clearText).capitalize().s;
    clearText = clearText.replace(/[а-я,.](?<dig>\d+)/g, ' $<dig> ');
    clearText = clearText.replace(/( {2})/g, ' ');
    clearText = clearText.trim();
    return {
      classRoom: clearText,
      distance: false,
    };
  }

  public static dateParser(date: string): Date {
    const correctDate = `${date}+03`;
    return moment(correctDate).toDate();
  }

  public static teacherParser(teacher: string): Omit<TeacherArgs, 'id'> | undefined {
    const match = teacher.match(/^([а-яё-]*).*?([а-яё]*) ([а-яё]*)$/i);
    if (!match || match.length < 4) {
      let clearText = teacher;
      clearText = clearText.replace(/(?<dig>\d+)/g, ' $<dig>');
      clearText = clearText.replace(/( {2})/g, ' ');
      clearText = clearText.trim();
      return {
        lastName: str(clearText).capitalize().s,
      };
    }

    return {
      firstName: str(match[2]).capitalize().s,
      lastName: str(match[1]).capitalize().s,
      middleName: str(match[3]).capitalize().s,
    };
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
