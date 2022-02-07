import { SubjectParsed } from './dstu-lesson.parser';
import { LessonTypeDefinition } from './lesson-type.definition';

interface SubjectPrettierDef {
  regex: RegExp;
  handler: (subject: string, match: RegExpMatchArray) => SubjectParsed;
}

export const pretties: SubjectPrettierDef[] = [
  {
    regex: /(Учебно-тренировочный|Физическая культура)/gi,
    handler: (subject, match) => {
      //пр. Учебно-тренировочный модуль (Киберспорт) => пр. Киберспорт
      if (subject.match(/Учебно/gi))
        return {
          type: LessonTypeDefinition[match[1]],
          name: match[3] || match[2],
        };
      else {
        //пр. Физическая культура и спорт (основная группа) => пр. Физическая культура и спорт
        if (subject.match(/основная/gi))
          return {
            type: LessonTypeDefinition[match[1]],
            name: 'Физическая культура и спорт', //FUCKED for пр. Физическая культура и спорт: основная группа
          };
        //пр. Физическая культура и спорт (Общая физическая подготовка) => пр. Общая физическая подготовка
        else
          return {
            type: LessonTypeDefinition[match[1]],
            name: match[3] || match[2],
          };
      }
    },
  },
  {
    regex: /Иностранный язык/gi,
    handler: (subject, match) => {
      // пр. Иностранный язык (английский) => пр. Английский язык
      return {
        type: LessonTypeDefinition[match[1]],
        name: match[3] ? `${match[3]} язык` : match[2],
      };
    },
  },
  {
    regex: /(лек|лаб|пр|зач|экз)\.? история/gi,
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
