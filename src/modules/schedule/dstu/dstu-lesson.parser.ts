import * as moment from 'moment';
import { LessonTypeDefinition } from './lesson-type.definition';
import { pretties } from './subject-prettier';
import * as str from 'string';
import { keys } from 'lodash';
import { LessonType } from '../../lesson/lesson-type.enum';
import { TeacherEntity } from '../../teacher/teacher.entity';

export interface SubjectInfo {
  type: LessonType;
  name: string;
  subgroup?: number;
  subsection?: string;
}

export interface TeacherInfo {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  degreeRaw?: string;
}

export default class DSTULessonParser {
  public static subjectParse(subject: string): SubjectInfo | undefined {
    let regex;
    const isBracketsExist = subject.indexOf('(') > -1;
    if (isBracketsExist && subject.indexOf(')') < 0) subject += ')';

    if (isBracketsExist) regex = this.withBracketsRegex();
    else regex = this.withoutBracketsRegex();

    /*console.log(subject);
    console.log(regex);*/
    const match = subject.match(regex);
    /*console.log(match);
    console.log('===============================\n\n');*/

    if (match && match.length > 2) {
      const pretty = this.subjectPrettier(subject, match);
      const result: SubjectInfo = {
        type: LessonTypeDefinition[match[1]],
        name: str(match[2]).capitalize().s,
      };

      if (!isBracketsExist) result.subgroup = match[3] ? parseInt(match[3]) : undefined;
      else result.subsection = match[3] ? match[3] : undefined;

      return pretty ? { ...pretty, name: str(pretty.name.trim()).capitalize().s } : result;
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
    clearText = clearText.replace(/(?<word>[а-я,.])(?<dig>\d+)/g, '$<word> $<dig> ');
    clearText = clearText.replace(/( {2})/g, ' ');
    clearText = clearText.replace(/[^а-я \d,.]/gi, '');
    clearText = clearText.trim();
    return {
      classRoom: str(clearText).capitalize().s,
      distance: false,
    };
  }

  public static dateParser(date: string): Date {
    const correctDate = `${date}+03`;
    return moment(correctDate).toDate();
  }

  public static teacherParser(teacher: string, degree?: string): TeacherInfo | undefined {
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
      degreeRaw: degree,
    };
  }

  private static subjectPrettier(subject: string, match: RegExpMatchArray): SubjectInfo | undefined {
    for (const pretty of pretties) {
      if (!subject.match(pretty.regex)) continue;

      const prettyResult = pretty.handler(subject, match);
      if (prettyResult && prettyResult.type && prettyResult.name) return prettyResult;
      return undefined;
    }
  }

  private static getLessonTypes(): string {
    return Object.keys(LessonTypeDefinition).join('|');
  }

  private static withoutBracketsRegex(): RegExp {
    const keys = this.getLessonTypes();
    return new RegExp(`(${keys})\\.? ([а-яa-z\\-. ,:\\/\\d]+?)(?:, п\\/г (\\d)|$)`, 'i');
  }

  private static withBracketsRegex(): RegExp {
    const keys = this.getLessonTypes();
    return new RegExp(`(${keys})\\.? ([а-яa-z\\-. ,:\\/\\d]+?) ?\\((.*?)\\)`, 'i');
  }
}
