import { TextTemplates } from './text-templates';

export class Text {
  constructor(private readonly template: HandlebarsTemplateDelegate, private readonly data?: any) {}

  public static Build(template: string, data?: any): Text {
    const templateDelegate = TextTemplates.get(template);
    if (!templateDelegate) throw new Error(`Template "${template}" not found`);
    return new Text(templateDelegate, data);
  }

  public render(): string {
    let rendered = this.template(this.data);
    rendered = rendered.replace(/^[ \t]*/gm, '');
    return rendered.trimEnd();
  }
}
