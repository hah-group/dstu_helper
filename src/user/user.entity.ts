import { Nullable } from '../util/nullable';
import { SocialSource } from '../bot/social.enum';

export interface UserArgs {
  id: number;
  firstName: string;
  lastName: string;
  groupId: Nullable<number>;
  socialType: SocialSource;
}

export class User {
  public readonly id: number;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly socialType: SocialSource;
  public groupId: Nullable<number>;

  constructor(params: UserArgs) {
    const { firstName, groupId, id, lastName, socialType } = params;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.groupId = groupId;
    this.socialType = socialType;
  }
}
