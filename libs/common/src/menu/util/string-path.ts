export class StringPath {
  public path!: string[];

  constructor(path: string) {
    this.set(path);
  }

  public set(path: string): void {
    this.path = path.split('.');
  }

  public up(): string | false {
    this.path = this.path.slice(0, this.path.length - 1);
    return this.get();
  }

  public down(path: string): string {
    this.path.push(path);
    return this.get();
  }

  public get(): string {
    if (this.path.length == 0) return 'default';

    return this.path.join('.');
  }

  public get parts(): string[] {
    return this.path;
  }
}
