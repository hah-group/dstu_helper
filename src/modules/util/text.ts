export class Text {
  public phrase: string;
  public data?: Record<string, any>;

  constructor(phrase: string, data?: Record<string, any>) {
    this.phrase = phrase;
    this.data = data;
  }
}
