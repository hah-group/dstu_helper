import DstuLessonParser from './dstu-lesson.parser';
import { LessonType } from '@prisma/client';

describe('Lesson parser', () => {
  it('Пра Учебная практика/Ознакомительная практика', () => {
    const result = DstuLessonParser.subjectParse('Пра Учебная практика/Ознакомительная практика');
    expect(result).toEqual({
      name: 'Учебная практика/ознакомительная практика',
      type: LessonType.PRACTICAL,
      subgroup: undefined,
    });
  });

  it('Пра Учебно-тренировочный модуль ( волейбол)', () => {
    const result = DstuLessonParser.subjectParse('Пра Учебно-тренировочный модуль ( волейбол)');
    expect(result).toEqual({
      name: 'Волейбол',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Физическая культура и спорт (специальная медицинская группа).', () => {
    const result = DstuLessonParser.subjectParse('пр. Физическая культура и спорт (специальная медицинская группа).');
    expect(result).toEqual({
      name: 'Физическая культура и спорт',
      type: LessonType.PRACTICAL,
    });
  });

  it('зчО Дискретная математика', () => {
    const result = DstuLessonParser.subjectParse('зчО Дискретная математика');
    expect(result).toEqual({
      name: 'Дискретная математика',
      type: LessonType.EXAM_WITHOUT_MARK,
    });
  });
});
