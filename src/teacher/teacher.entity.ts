export interface TeacherArgs {
  id: number;
  firstName?: string;
  lastName: string;
  middleName?: string;
}

export class Teacher {
  public readonly id: number;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly middleName: string;

  constructor(params: TeacherArgs) {
    const { firstName, id, lastName, middleName } = params;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
  }
}
