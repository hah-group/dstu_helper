import { ContentTemplates } from './content-templates';

export class Content {
  constructor(private readonly template: HandlebarsTemplateDelegate, private readonly data?: any) {}

  public static Build(template: string, data?: any): Content {
    const templateDelegate = ContentTemplates.get(template);
    if (!templateDelegate) throw new Error(`Template "${template}" not found`);
    return new Content(templateDelegate, data);
  }

  public render(extra?: any): string {
    try {
      let rendered = this.template(this.data, { data: extra });
      rendered = rendered.replace(/^[ \t]*/gm, '');
      return rendered.trimEnd();
    } catch (e) {
      console.log(e);
      return '';
    }
  }
}
