export abstract class PropertyBase<JS, DB = JS> {
  public readonly _type!: JS;

  public readonly name: string;

  protected constructor(name: string) {
    this.name = name;
  }

  public abstract get(): JS;

  public abstract set(value: JS, ...args: any[]): void;

  public abstract render(): DB;

  public abstract isEquals(value: JS): boolean;
}
