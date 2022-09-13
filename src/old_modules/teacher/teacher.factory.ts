import { Teacher, TeacherArgs } from './teacher.entity';

export class TeacherFactory {
  public static create(params: TeacherArgs): Teacher {
    return new Teacher(params);
  }
}
