import { Moment } from '@dstu_helper/common';
import * as lodash from 'lodash';
import { normalizeWhiteSpaces } from 'normalize-text';
import * as str from 'string';

import { TeacherDegreeDefinition, TeacherDegreeKeys } from '../../teacher/teacher-degree.definition';
import { TeacherDegree } from '../../teacher/teacher-degree.enum';
import { LessonType } from '../lesson-type.enum';
import { pretties } from './lesson.prettier';
import { FinalTextFilter, firstLetterUpper } from './text-filter/final.text-filter';
import { LessonTypeTextFilter } from './text-filter/lesson-type.text-filter';
import { SubgroupTextFilter } from './text-filter/subgroup.text-filter';
import { TextFilterBuilder } from './text-filter/text-filter.builder';

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
  degree: TeacherDegree;
}

export interface AudienceInfo {
  corpus?: string;
  classRoom?: string;
  distance: boolean;
}

export interface SubsectionFilterResult {
  subsection: string;
  filtered: string;
}

export default class DSTULessonParser {
  public static ParseSubject(subject: string): SubjectInfo | undefined {
    const normalText = normalizeWhiteSpaces(subject);

    const filters = new TextFilterBuilder([LessonTypeTextFilter, SubgroupTextFilter, FinalTextFilter]);
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

  public static ParseSubsection(subject: string): SubsectionFilterResult | undefined {
    const regex = new RegExp(/\((.*?)\)([^ ]|$)/, 'i');
    const match = subject.match(regex);

    if (match && match[1]) {
      const subsection = firstLetterUpper(match[1].trim());
      return {
        subsection: subsection.trim(),
        filtered: subject.replace(`(${match[1]})`, '').trim(),
      };
    }
  }

  public static ParseAudience(classRoom: string): AudienceInfo | undefined {
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
    if (clearText.length > 0)
      return {
        classRoom: str(clearText).capitalize().s,
        distance: false,
      };
  }

  public static ParseDate(date: string): Date {
    const correctDate = `${date}+03`;
    return Moment(correctDate).toDate();
  }

  public static ParseTeacher(teacher?: string, degreeRaw?: string): TeacherInfo | undefined {
    if (!teacher) return;
    let degree = degreeRaw ? TeacherDegreeDefinition[degreeRaw] : undefined;

    const degreeMatch = teacher.match(new RegExp(`(${TeacherDegreeKeys()})`, 'ig'));
    if (degreeMatch && degreeMatch[1]) degree = TeacherDegreeDefinition[<string>degreeMatch[1]];

    let clearText = teacher.replace(new RegExp(TeacherDegreeKeys(), 'gi'), '');
    clearText = clearText.replace(/(?<dig>\d+)/g, ' $<dig>');
    clearText = clearText.replace(/( {2})/g, ' ');
    clearText = clearText.trim();

    const names = clearText.split(' ');
    return {
      lastName: str(names[0] || clearText).capitalize().s,
      firstName: names[1] && str(names[1]).capitalize().s,
      middleName: names[2] && str(names[2]).capitalize().s,
      degree: degree || TeacherDegree.NON_TYPE,
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
