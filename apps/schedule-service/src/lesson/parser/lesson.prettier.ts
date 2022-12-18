import { LessonType } from '../lesson-type.enum';
import DSTULessonParser, { SubjectInfo } from './lesson.parser';
import { firstLetterUpper } from './text-filter/final.text-filter';

interface SubjectPrettierDef {
  regex: RegExp;
  handler: (subject: SubjectInfo) => SubjectInfo | undefined;
}

const EXTRACT_QUOTES = /"(.*)"/g;

export const pretties: SubjectPrettierDef[] = [
  {
    regex: /(Учебно-тренировочный|Физическая культура)/gi,
    handler: (subject) => {
      const subsectionResult = DSTULessonParser.ParseSubsection(subject.name);
      if (subsectionResult) {
        if (subsectionResult.subsection.match(/Специальная/i)) {
          return {
            type: LessonType.PHYSICAL_EDUCATION,
            name: subsectionResult.filtered,
            subsection: subsectionResult.subsection,
          };
        }
        return {
          type: LessonType.PHYSICAL_EDUCATION,
          name: subsectionResult.subsection,
        };
      }
      return {
        type: LessonType.PHYSICAL_EDUCATION,
        name: subject.name,
      };
    },
  },
  {
    regex: /Иностранный язык/gi,
    handler: (subject) => {
      const subsectionResult = DSTULessonParser.ParseSubsection(subject.name);
      if (subsectionResult)
        return {
          type: subject.type,
          name: `${subsectionResult.subsection} язык`,
        };
    },
  },
  {
    regex: /История/,
    handler: (subject) => {
      // пр. История (история России, всеобщая история) => пр. История
      const subsectionResult = DSTULessonParser.ParseSubsection(subject.name);
      if (subsectionResult) {
        if (subsectionResult.subsection.match(/история/i)) {
          return {
            type: subject.type,
            name: subsectionResult.subsection,
          };
        }
      }
      return {
        type: subject.type,
        name: subject.name,
      };
    },
  },
  {
    regex: /Основы проектной/gi,
    handler: (subject) => {
      const subsectionResult = DSTULessonParser.ParseSubsection(subject.name);
      //пр. Основы проектной деятельности (Кирпич. Версия 2.0) => пр. Основы проектной деятельности
      return {
        type: subject.type,
        name: `Проект`,
        subsection: subsectionResult?.subsection || null,
      };
    },
  },
  {
    regex: /""/gi,
    handler: (subject) => {
      //пр. "Проект ""Геймдизайн"" => пр. Проект
      //пр. "Основы проектирования ""зеленого каркаса"" градостроительного пространства" => пр. Основы проектирования "зеленого каркаса" градостроительного пространства

      let clearedSubject = subject.name;
      clearedSubject = clearedSubject.replace(EXTRACT_QUOTES, '$1');
      clearedSubject = clearedSubject.replace(EXTRACT_QUOTES, '$1');

      if (clearedSubject.match(/проект /i)) {
        const match = clearedSubject.match(/"(.*?)"/i);
        if (match && match[1]) {
          const subsection = firstLetterUpper(match[1]);
          clearedSubject = firstLetterUpper(
            clearedSubject.replace(match[1], '').replace(/"*/g, '').replace(/ +/g, ' ').trim(),
          );
          return {
            type: subject.type,
            name: clearedSubject,
            subsection: subsection,
          };
        }
      } else {
        return {
          type: subject.type,
          name: clearedSubject,
        };
      }
    },
  },
  {
    regex: /web/gi,
    handler: (subject) => {
      //пр. "web-программирование" => пр. WEB-программирование
      return {
        type: subject.type,
        name: subject.name.replace(/web/gi, 'WEB'),
      };
    },
  },
  {
    regex: /\. net/gi, //Crutch due to point normalization
    handler: (subject) => {
      return {
        type: subject.type,
        name: subject.name.replace(/\. net/gi, ' .NET'),
      };
    },
  },
];
