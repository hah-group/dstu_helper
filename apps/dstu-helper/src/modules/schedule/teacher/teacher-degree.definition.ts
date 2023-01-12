import { TeacherDegree } from './teacher-degree.enum';

export const TeacherDegreeDefinition: Record<string, TeacherDegree> = {
  'Асс.': TeacherDegree.ASSISTANT,
  'Дек.': TeacherDegree.DEAN,
  'Доц.': TeacherDegree.DOCENT,
  'Зав.к.': TeacherDegree.DEPARTMENT_CHAIRMAN,
  'Преп.': TeacherDegree.TEACHER,
  'Проф.': TeacherDegree.PROFESSOR,
  'Ст.пр.': TeacherDegree.SENIOR_TEACHER,
};

export const TeacherDegreeKeys: () => string = () => {
  return Object.keys(TeacherDegreeDefinition).join('|');
};
