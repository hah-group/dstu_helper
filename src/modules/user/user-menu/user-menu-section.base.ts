export abstract class UserMenuSectionBase<T> {
  public abstract reset(): void;

  public abstract toObject(): T;
}
