import { SubjectInfo } from './dstu-lesson.parser';
import { LessonTypeDefinition } from './lesson-type.definition';
import { LessonType } from '../../lesson/lesson-type.enum';
import * as str from 'string';

interface SubjectPrettierDef {
  regex: RegExp;
  handler: (subject: string, match: RegExpMatchArray) => SubjectInfo;
}

const getLessonTypes = () => Object.keys(LessonTypeDefinition).join('|');

export const pretties: SubjectPrettierDef[] = [
  {
    regex: /(Учебно-тренировочный|Физическая культура)/gi,
    handler: (subject, match) => {
      //пр. Учебно-тренировочный модуль (Киберспорт) => пр. Киберспорт
      if (subject.match(/Учебно/gi))
        return {
          type: LessonType.PHYSICAL_EDUCATION,
          name: str((match[3] || match[2]).trim()).capitalize().s,
        };
      else {
        //пр. Физическая культура и спорт (основная группа) => пр. Физическая культура и спорт
        if (subject.match(/основная/gi))
          return {
            type: LessonType.PHYSICAL_EDUCATION,
            //ЕБАНЫЙ УЧЕБНЫЙ ОТДЕЛ ПИШИТЕ ОДИНАКОВО ДИСЦИПЛИНЫ. ЧТО ЭТО ТАКОЕ??: пр. Физическая культура и спорт: основная группа
            name: 'Физическая культура и спорт',
          };
        //пр. Физическая культура и спорт (Специальная медицинская группа) => пр. Общая физическая подготовка
        else if (subject.match(/медицинская/gi))
          return {
            type: LessonType.PHYSICAL_EDUCATION,
            //ЕБАНЫЙ УЧЕБНЫЙ ОТДЕЛ ПИШИТЕ ОДИНАКОВО ДИСЦИПЛИНЫ. ЧТО ЭТО ТАКОЕ??: пр. Физическая культура и спорт (Специальная медицинская группа)
            name: 'Физическая культура и спорт',
          };
        else {
          if (isNaN(parseFloat(match[3]))) {
            return {
              type: LessonType.PHYSICAL_EDUCATION,
              name: str((match[3] || match[2]).trim()).capitalize().s,
            };
          } else {
            return {
              type: LessonType.PHYSICAL_EDUCATION,
              name: str(match[2].trim()).capitalize().s,
            };
          }
        }
      }
    },
  },
  {
    regex: /Иностранный язык/gi,
    handler: (subject, match) => {
      // пр. Иностранный язык (английский) => пр. Английский язык
      if (isNaN(parseFloat(match[3]))) {
        return {
          type: LessonTypeDefinition[match[1]],
          name: match[3] ? `${match[3]} язык` : match[2],
        };
      } else {
        return {
          type: LessonTypeDefinition[match[1]],
          name: match[2],
        };
      }
    },
  },
  {
    regex: new RegExp(`(${getLessonTypes()}).*? история`, 'gi'),
    handler: (subject, match) => {
      // пр. История (история России, всеобщая история) => пр. История
      return {
        type: LessonTypeDefinition[match[1]],
        name: match[2],
      };
    },
  },
  {
    regex: /Основы проектной/gi,
    handler: (subject, match) => {
      //пр. Основы проектной деятельности (Кирпич. Версия 2.0) => пр. Основы проектной деятельности
      return {
        type: LessonTypeDefinition[match[1]],
        name: `Проект`,
        subsection: match[3] || match[2],
      };
    },
  },
];
