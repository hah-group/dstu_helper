import { StringProperty } from './string.property';

export class StringPathProperty extends StringProperty {
  public to(path: string): void {
    this.set(`${this.get()}.${path}`);
  }

  public back(): void {
    const sourcePath = this.get().split('.');
    const newPath = sourcePath.slice(0, sourcePath.length - 1);
    if (newPath.length == 0) {
      this.set();
      return;
    }

    this.set(newPath.join('.'));
  }
}
