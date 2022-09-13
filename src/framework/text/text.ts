import { TextTemplates } from './text-templates';

export class Text {
  constructor(private readonly template: HandlebarsTemplateDelegate, private readonly data?: any) {}

  public static Build(template: string, data?: any): Text {
    return new Text(TextTemplates.get(template), data);
  }

  public render(): string {
    return this.template(this.data);
  }
}
