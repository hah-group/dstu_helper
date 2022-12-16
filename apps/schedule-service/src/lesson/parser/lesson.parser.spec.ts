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
});
