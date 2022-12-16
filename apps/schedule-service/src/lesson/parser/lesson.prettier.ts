import { LessonType } from '../lesson-type.enum';
import { SubjectInfo } from './lesson.parser';

interface SubjectPrettierDef {
  regex: RegExp;
  handler: (subject: SubjectInfo) => SubjectInfo;
}

export const pretties: SubjectPrettierDef[] = [
  {
    regex: /(Учебно-тренировочный|Физическая культура)/gi,
    handler: (subject) => {
      //пр. Учебно-тренировочный модуль (Киберспорт) => пр. Киберспорт
      if (subject.name.match(/Учебно/gi))
        return {
          type: LessonType.PHYSICAL_EDUCATION,
          name: subject.subsection || subject.name,
          subsection: null,
        };
      else {
        //пр. Физическая культура и спорт (основная группа) => пр. Физическая культура и спорт
        if (subject.subsection?.match(/основная/gi))
          return {
            type: LessonType.PHYSICAL_EDUCATION,
            //ЕБАНЫЙ УЧЕБНЫЙ ОТДЕЛ ПИШИТЕ ОДИНАКОВО ДИСЦИПЛИНЫ. ЧТО ЭТО ТАКОЕ??: пр. Физическая культура и спорт: основная группа
            name: 'Физическая культура и спорт',
          };
        else if (subject.subsection?.match(/медицинская/gi))
          return {
            type: LessonType.PHYSICAL_EDUCATION,
            //ЕБАНЫЙ УЧЕБНЫЙ ОТДЕЛ ПИШИТЕ ОДИНАКОВО ДИСЦИПЛИНЫ. ЧТО ЭТО ТАКОЕ??: пр. Физическая культура и спорт (Специальная медицинская группа)
            name: 'Физическая культура и спорт',
          };
        else
          return {
            type: LessonType.PHYSICAL_EDUCATION,
            name: 'Физическая культура',
          };
      }
    },
  },
  {
    regex: /Иностранный язык/gi,
    handler: (subject) => {
      // пр. Иностранный язык (английский) => пр. Английский язык
      return {
        type: subject.type,
        name: `${subject.subsection} язык`,
        subsection: null,
      };
    },
  },
  {
    regex: /История/,
    handler: (subject) => {
      // пр. История (история России, всеобщая история) => пр. История
      return {
        type: subject.type,
        name: subject.subsection || subject.name,
      };
    },
  },
  {
    regex: /Основы проектной/gi,
    handler: (subject) => {
      //пр. Основы проектной деятельности (Кирпич. Версия 2.0) => пр. Основы проектной деятельности
      return {
        type: subject.type,
        name: `Проект`,
        subsection: subject.subsection,
      };
    },
  },
];
