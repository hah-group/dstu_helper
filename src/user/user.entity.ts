import { Nullable } from '../util/nullable';

export interface UserArgs {
  id: number;
  firstName: string;
  lastName: string;
  groupId: Nullable<number>;
}

export class User {
  public readonly id: number;
  public readonly firstName: string;
  public readonly lastName: string;
  public groupId: Nullable<number>;

  constructor(params: UserArgs) {
    const { firstName, groupId, id, lastName } = params;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.groupId = groupId;
  }
}
