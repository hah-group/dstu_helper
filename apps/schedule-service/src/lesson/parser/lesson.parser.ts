import * as str from 'string';
import { LessonTypeTextFilter } from './text-filter/lesson-type.text-filter';
import { TextFilterBuilder } from './text-filter/text-filter.builder';
import { SubgroupTextFilter } from './text-filter/subgroup.text-filter';
import { SubsectionTextFilter } from './text-filter/subsection.text-filter';
import * as lodash from 'lodash';
import { LessonType } from '../lesson-type.enum';
import { pretties } from './lesson.prettier';
import { Moment } from '@dstu_helper/common';
import { normalizeWhiteSpaces } from 'normalize-text';

export interface SubjectInfo {
  type: LessonType;
  name: string;
  subgroup?: number | null;
  subsection?: string | null;
}

export interface TeacherInfo {
  firstName?: string;
  lastName: string;
  middleName?: string;
  degreeRaw?: string;
}

export interface AudienceInfo {
  corpus?: string;
  classRoom?: string;
  distance: boolean;
}

export default class DSTULessonParser {
  public static ParseSubject(subject: string): SubjectInfo | undefined {
    const normalText = normalizeWhiteSpaces(subject);

    const filters = new TextFilterBuilder([LessonTypeTextFilter, SubgroupTextFilter, SubsectionTextFilter]);
    const filterResult = filters.execute(normalText);

    const result: SubjectInfo = lodash.merge(filterResult, this.subjectPrettier(filterResult));
    return <SubjectInfo>Object.fromEntries(Object.entries(result).filter(([key, value]) => !!value));
  }

  public static ParseSubgroup(subject: string): number {
    const normalText = normalizeWhiteSpaces(subject);
    const filters = new TextFilterBuilder([SubgroupTextFilter]);
    const filterResult = filters.execute(normalText);
    return filterResult.subgroup || -1;
  }

  public static ParseAudience(classRoom: string): AudienceInfo {
    const match = classRoom.match(/^(\d+)-(\d+[а-я]?)$/i);
    const matchDistance = !!classRoom.match(/Д[ОO0]/i);

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

  public static ParseDate(date: string): Date {
    const correctDate = `${date}+03`;
    return Moment(correctDate).toDate();
  }

  public static ParseTeacher(teacher?: string, degree?: string): TeacherInfo | undefined {
    if (!teacher) return;
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

  private static subjectPrettier(subject: SubjectInfo): SubjectInfo | undefined {
    for (const pretty of pretties) {
      if (!subject.name.match(pretty.regex)) continue;

      const prettyResult = pretty.handler(subject);
      if (prettyResult && prettyResult.type && prettyResult.name) return prettyResult;
      return undefined;
    }
  }
}
