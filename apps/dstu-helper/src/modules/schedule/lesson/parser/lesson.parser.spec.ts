import { LessonType } from '../lesson-type.enum';
import DSTULessonParser from './lesson.parser';

describe('Lesson parser', () => {
  it('Пра Учебная практика/Ознакомительная практика', () => {
    const result = DSTULessonParser.ParseSubject('Пра Учебная практика/Ознакомительная практика');
    expect(result).toEqual({
      name: 'Учебная практика/Ознакомительная практика',
      type: LessonType.PRACTICAL,
    });
  });

  it('Пра Учебно-тренировочный модуль ( волейбол)', () => {
    const result = DSTULessonParser.ParseSubject('Пра Учебно-тренировочный модуль ( волейбол)');
    expect(result).toEqual({
      name: 'Волейбол',
      type: LessonType.PHYSICAL_EDUCATION,
    });
  });

  it('пр. Физическая культура и спорт (специальная медицинская группа).', () => {
    const result = DSTULessonParser.ParseSubject('пр. Физическая культура и спорт (специальная медицинская группа).');
    expect(result).toEqual({
      name: 'Физическая культура и спорт',
      type: LessonType.PHYSICAL_EDUCATION,
      subsection: 'Специальная медицинская группа',
    });
  });

  it('зчО Дискретная математика', () => {
    const result = DSTULessonParser.ParseSubject('зчО Дискретная математика');
    expect(result).toEqual({
      name: 'Дискретная математика',
      type: LessonType.EXAM_WITHOUT_MARK,
    });
  });

  it('лек Водоёмы комплексного назначения и фермерское рыбоводство', () => {
    const result = DSTULessonParser.ParseSubject('лек Водоёмы комплексного назначения и фермерское рыбоводство');
    expect(result).toEqual({
      name: 'Водоёмы комплексного назначения и фермерское рыбоводство',
      type: LessonType.LECTURE,
    });
  });

  it('лек Information Tehnology in Economics /Информационные технологии в экономике)', () => {
    const result = DSTULessonParser.ParseSubject(
      'лек Information Tehnology in Economics /Информационные технологии в экономике)',
    );
    expect(result).toEqual({
      name: 'Information Tehnology in Economics/Информационные технологии в экономике',
      type: LessonType.LECTURE,
      subgroup: undefined,
    });
  });

  it('лек Программирование микропроцессорных средств радиотехнических систем с использованием С++', () => {
    const result = DSTULessonParser.ParseSubject(
      'лек Программирование микропроцессорных средств радиотехнических систем с использованием С++',
    );
    expect(result).toEqual({
      name: 'Программирование микропроцессорных средств радиотехнических систем с использованием С++',
      type: LessonType.LECTURE,
    });
  });

  it('Возведение высотных и большепролетных зданий и сооружений, п/г 7', () => {
    const result = DSTULessonParser.ParseSubject('Возведение высотных и большепролетных зданий и сооружений, п/г 7');
    expect(result).toEqual({
      name: 'Возведение высотных и большепролетных зданий и сооружений',
      type: LessonType.NON_TYPE,
      subgroup: 7,
    });
  });

  it('МДК.01.02 Психология социально-правовой деятельности', () => {
    const result = DSTULessonParser.ParseSubject('МДК.01.02 Психология социально-правовой деятельности');
    expect(result).toEqual({
      name: 'МДК.01.02 Психология социально-правовой деятельности',
      type: LessonType.NON_TYPE,
    });
  });

  it('Физическая культура, п/г 2', () => {
    const result = DSTULessonParser.ParseSubject('Физическая культура, п/г 2');
    expect(result).toEqual({
      name: 'Физическая культура',
      type: LessonType.PHYSICAL_EDUCATION,
      subgroup: 2,
    });
  });

  it('лаб Конструирование и расчёт подъемно-транспортных, строительных, дорожных средств и оборудования, п/г 1', () => {
    const result = DSTULessonParser.ParseSubject(
      'лаб Конструирование и расчёт подъемно-транспортных, строительных, дорожных средств и оборудования, п/г 1',
    );
    expect(result).toEqual({
      name: 'Конструирование и расчёт подъемно-транспортных, строительных, дорожных средств и оборудования',
      type: LessonType.LABORATORY,
      subgroup: 1,
    });
  });

  it('пр. Иностранный язык (английский), п/г 2', () => {
    const result = DSTULessonParser.ParseSubject('пр. Иностранный язык (английский), п/г 2');
    expect(result).toEqual({
      name: 'Английский язык',
      type: LessonType.PRACTICAL,
      subgroup: 2,
    });
  });

  it('лек Цифровизация (диджитализация)  бизнес-процессов', () => {
    const result = DSTULessonParser.ParseSubject('лек Цифровизация (диджитализация)  бизнес-процессов');
    expect(result).toEqual({
      name: 'Цифровизация (диджитализация) бизнес-процессов',
      type: LessonType.LECTURE,
    });
  });

  it('пр. Иностранный язык в профессиональной деятельности, п/г 2', () => {
    const result = DSTULessonParser.ParseSubject('пр. Иностранный язык в профессиональной деятельности, п/г 2');
    expect(result).toEqual({
      name: 'Иностранный язык в профессиональной деятельности',
      type: LessonType.PRACTICAL,
      subgroup: 2,
    });
  });

  it('пр. "Проект ""Геймдизайн"""', () => {
    const result = DSTULessonParser.ParseSubject('пр. "Проект ""Геймдизайн"""');
    expect(result).toEqual({
      name: 'Проект',
      type: LessonType.PRACTICAL,
      subsection: 'Геймдизайн',
    });
  });

  it('пр. Физико- технические основы Индустрии 4.0', () => {
    const result = DSTULessonParser.ParseSubject('пр. Физико- технические основы Индустрии 4.0');
    expect(result).toEqual({
      type: LessonType.PRACTICAL,
      name: 'Физико-технические основы Индустрии 4.0',
    });
  });

  it('пр. Тепло- и хладогеника', () => {
    const result = DSTULessonParser.ParseSubject('пр. Тепло- и хладогеника');
    expect(result).toEqual({
      name: 'Тепло и хладогеника',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Ресурсо- и энергосберегающие технологии и материалы', () => {
    const result = DSTULessonParser.ParseSubject('пр. Ресурсо- и энергосберегающие технологии и материалы');
    expect(result).toEqual({
      name: 'Ресурсо и энергосберегающие технологии и материалы',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. WEB-программирование', () => {
    const result = DSTULessonParser.ParseSubject('пр. WEB-программирование');
    expect(result).toEqual({
      name: 'WEB-программирование',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. web-программирование', () => {
    const result = DSTULessonParser.ParseSubject('пр. web-программирование');
    expect(result).toEqual({
      name: 'WEB-программирование',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Программирование под платформу .NET', () => {
    const result = DSTULessonParser.ParseSubject('пр. Программирование под платформу .NET');
    expect(result).toEqual({
      name: 'Программирование под платформу .NET',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Индустрия 4.0', () => {
    const result = DSTULessonParser.ParseSubject('пр. Индустрия 4.0');
    expect(result).toEqual({
      name: 'Индустрия 4.0',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Проект – полный цикл разработки игр и приложений', () => {
    const result = DSTULessonParser.ParseSubject('пр. Проект – полный цикл разработки игр и приложений');
    expect(result).toEqual({
      name: 'Проект – полный цикл разработки игр и приложений',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. "Основы проектирования ""зеленого каркаса"" градостроительного пространства"', () => {
    const result = DSTULessonParser.ParseSubject(
      'пр. "Основы проектирования ""зеленого каркаса"" градостроительного пространства"',
    );
    expect(result).toEqual({
      name: 'Основы проектирования "зеленого каркаса" градостроительного пространства',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Теоретические основы электротехники ч.1', () => {
    const result = DSTULessonParser.ParseSubject('пр. Теоретические основы электротехники ч.1');
    expect(result).toEqual({
      name: 'Теоретические основы электротехники ч. 1',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. История (история России, всеобщая история)', () => {
    const result = DSTULessonParser.ParseSubject('пр. История (история России, всеобщая история)');
    expect(result).toEqual({
      name: 'История России, всеобщая история',
      type: LessonType.PRACTICAL,
    });
  });

  it('пр. Практический курс второго иностранного языка (испанский), п/г 3', () => {
    const result = DSTULessonParser.ParseSubject('пр. Практический курс второго иностранного языка (испанский), п/г 3');
    expect(result).toEqual({
      name: 'Практический курс второго иностранного языка (испанский)',
      type: LessonType.PRACTICAL,
      subgroup: 3,
    });
  });

  it('лек Информационные системы бизнеса (1С: Предприятие)', () => {
    const result = DSTULessonParser.ParseSubject('лек Информационные системы бизнеса (1С: Предприятие)');
    expect(result).toEqual({
      name: 'Информационные системы бизнеса (1С: Предприятие)',
      type: LessonType.LECTURE,
    });
  });
});
