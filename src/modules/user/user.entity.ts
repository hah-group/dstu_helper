import { Nullable } from '../util/nullable';
import { UserStage } from './user-stage.enum';
import { UserMenu } from './user-menu/user-menu.entity';
import { SocialSource } from 'src/framework/bot/type/social.enum';

export interface UserArgs {
  id: number;
  firstName: string;
  lastName: string;
  groupId: Nullable<number>;
  socialType: SocialSource;
  stage: UserStage;
  menu: UserMenu;
  locale: string;
}

export class User {
  public readonly id: number;
  public readonly firstName: string;
  public readonly lastName?: string;
  public readonly socialType: SocialSource;
  public readonly menu: UserMenu;
  public locale: string;
  public groupId: Nullable<number>;

  constructor(params: UserArgs) {
    const { firstName, groupId, id, lastName, socialType, stage, menu, locale } = params;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.groupId = groupId;
    this.socialType = socialType;
    this._stage = stage;
    this.menu = menu;
    this.locale = locale;
  }

  private _stage: UserStage;

  public get stage(): UserStage {
    return this._stage;
  }

  public set stage(value) {
    this._stage = value;
  }

  public groupIsInitialized(): boolean {
    return !!this.groupId;
  }
}
