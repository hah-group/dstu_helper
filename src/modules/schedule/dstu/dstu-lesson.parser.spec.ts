import DSTULessonParser from './dstu-lesson.parser';
import { LessonType } from '../../lesson/lesson-type.enum';

describe('Lesson parser', () => {
  it('Пра Учебная практика/Ознакомительная практика', () => {
    const result = DSTULessonParser.subjectParse('Пра Учебная практика/Ознакомительная практика');
    expect(result).toEqual({
      name: 'Учебная практика/ознакомительная практика',
      type: LessonType.PRACTICAL,
    });
  });

  it('Пра Учебно-тренировочный модуль ( волейбол)', () => {
    const result = DSTULessonParser.subjectParse('Пра Учебно-тренировочный модуль ( волейбол)');
    expect(result).toEqual({
      name: 'Волейбол',
      type: LessonType.PHYSICAL_EDUCATION,
    });
  });

  it('пр. Физическая культура и спорт (специальная медицинская группа).', () => {
    const result = DSTULessonParser.subjectParse('пр. Физическая культура и спорт (специальная медицинская группа).');
    expect(result).toEqual({
      name: 'Физическая культура и спорт',
      type: LessonType.PHYSICAL_EDUCATION,
    });
  });

  it('зчО Дискретная математика', () => {
    const result = DSTULessonParser.subjectParse('зчО Дискретная математика');
    expect(result).toEqual({
      name: 'Дискретная математика',
      type: LessonType.EXAM_WITHOUT_MARK,
    });
  });

  it('лек Водоёмы комплексного назначения и фермерское рыбоводство', () => {
    const result = DSTULessonParser.subjectParse('лек Водоёмы комплексного назначения и фермерское рыбоводство');
    expect(result).toEqual({
      name: 'Водоёмы комплексного назначения и фермерское рыбоводство',
      type: LessonType.LECTURE,
    });
  });

  it('лек Information Tehnology in Economics /Информационные технологии в экономике)', () => {
    const result = DSTULessonParser.subjectParse(
      'лек Information Tehnology in Economics /Информационные технологии в экономике)',
    );
    expect(result).toEqual({
      name: 'Information tehnology in economics /информационные технологии в экономике',
      type: LessonType.LECTURE,
    });
  });

  it('лек Программирование микропроцессорных средств радиотехнических систем с использованием С++', () => {
    const result = DSTULessonParser.subjectParse(
      'лек Программирование микропроцессорных средств радиотехнических систем с использованием С++',
    );
    expect(result).toEqual({
      name: 'Программирование микропроцессорных средств радиотехнических систем с использованием с++',
      type: LessonType.LECTURE,
    });
  });

  it('Физическая культура, п/г 2', () => {
    const result = DSTULessonParser.subjectParse('Физическая культура, п/г 2');
    expect(result).toEqual({
      name: 'Физическая культура',
      type: LessonType.PHYSICAL_EDUCATION,
      subgroup: 2,
    });
  });

  it('лаб Конструирование и расчёт подъемно-транспортных, строительных, дорожных средств и оборудования, п/г 1', () => {
    const result = DSTULessonParser.subjectParse(
      'лаб Конструирование и расчёт подъемно-транспортных, строительных, дорожных средств и оборудования, п/г 1',
    );
    expect(result).toEqual({
      name: 'Конструирование и расчёт подъемно-транспортных, строительных, дорожных средств и оборудования',
      type: LessonType.LABORATORY,
      subgroup: 1,
    });
  });

  it('пр. Иностранный язык (английский), п/г 2', () => {
    const result = DSTULessonParser.subjectParse('пр. Иностранный язык (английский), п/г 2');
    expect(result).toEqual({
      name: 'Английский язык',
      type: LessonType.PRACTICAL,
      subgroup: 2,
    });
  });

  it('пр. Иностранный язык в профессиональной деятельности, п/г 2', () => {
    const result = DSTULessonParser.subjectParse('пр. Иностранный язык в профессиональной деятельности, п/г 2');
    expect(result).toEqual({
      name: 'Иностранный язык в профессиональной деятельности',
      type: LessonType.PRACTICAL,
      subgroup: 2,
    });
  });

  it('пр. "Проект ""Геймдизайн"""', () => {
    const result = DSTULessonParser.subjectParse('пр. "Проект ""Геймдизайн"""');
    expect(result).toEqual({
      name: 'Проект',
      type: LessonType.PRACTICAL,
      subsection: 'Геймдизайн',
    });
  });

  it('пр. Физико- технические основы Индустрии 4.0', () => {
    const result = DSTULessonParser.subjectParse('пр. Физико- технические основы Индустрии 4.0');
    expect(result).toEqual({
      type: LessonType.PRACTICAL,
      name: 'Физико- технические основы индустрии 4.0',
    });
  });

  it('пр. Тепло- и хладогеника', () => {
    const result = DSTULessonParser.subjectParse('пр. Тепло- и хладогеника');
    expect(result).toEqual({
      name: 'Тепло- и хладогеника',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Ресурсо- и энергосберегающие технологии и материалы', () => {
    const result = DSTULessonParser.subjectParse('пр. Ресурсо- и энергосберегающие технологии и материалы');
    expect(result).toEqual({
      name: 'Ресурсо- и энергосберегающие технологии и материалы',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. WEB-программирование', () => {
    const result = DSTULessonParser.subjectParse('пр. WEB-программирование');
    expect(result).toEqual({
      name: 'Web-программирование',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. web-программирование', () => {
    const result = DSTULessonParser.subjectParse('пр. web-программирование');
    expect(result).toEqual({
      name: 'Web-программирование',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Программирование под платформу .NET', () => {
    const result = DSTULessonParser.subjectParse('пр. Программирование под платформу .NET');
    expect(result).toEqual({
      name: 'Программирование под платформу .net',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Индустрия 4.0', () => {
    const result = DSTULessonParser.subjectParse('пр. Индустрия 4.0');
    expect(result).toEqual({
      name: 'Индустрия 4.0',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Теоретические основы электротехники ч.1', () => {
    const result = DSTULessonParser.subjectParse('пр. Теоретические основы электротехники ч.1');
    expect(result).toEqual({
      name: 'Теоретические основы электротехники ч.1',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. История (история России, всеобщая история)', () => {
    const result = DSTULessonParser.subjectParse('пр. История (история России, всеобщая история)');
    expect(result).toEqual({
      name: 'История',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Практический курс второго иностранного языка (испанский), п/г 3', () => {
    const result = DSTULessonParser.subjectParse('пр. Практический курс второго иностранного языка (испанский), п/г 3');
    expect(result).toEqual({
      name: 'Практический курс второго иностранного языка',
      type: LessonType.PRACTICAL,
      subsection: 'Испанский',
      subgroup: 3,
    });
  });

  it('лек Информационные системы бизнеса (1С: Предприятие)', () => {
    const result = DSTULessonParser.subjectParse('лек Информационные системы бизнеса (1С: Предприятие)');
    expect(result).toEqual({
      name: 'Информационные системы бизнеса',
      subsection: '1с: предприятие',
      type: LessonType.LECTURE,
    });
  });
});
