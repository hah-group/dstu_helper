import DstuLessonParser from './dstu-lesson.parser';
import { LessonType } from '@prisma/client';

describe('Lesson parser', () => {
  it('Пра Учебная практика/Ознакомительная практика', () => {
    const result = DstuLessonParser.subjectParse('Пра Учебная практика/Ознакомительная практика');
    expect(result).toEqual({
      name: 'Учебная практика/Ознакомительная практика',
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
});
