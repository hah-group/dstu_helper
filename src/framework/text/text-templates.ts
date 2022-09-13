import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { glob } from 'glob';

const loadTemplates: () => Map<string, HandlebarsTemplateDelegate> = () => {
  const log = new Logger('TextTemplate');
  const filesPath = path.join(process.cwd(), 'dist', '**', `*.hbs`);
  const files = glob.sync(filesPath);

  log.log(`Start loading templates`);
  const globalStartTime = Date.now();

  const result: Map<string, HandlebarsTemplateDelegate> = new Map();
  for (const file of files) {
    log.log(`Start load template "${file}"`);
    const startTime = Date.now();

    const basename = path.basename(file).split('.')[0];
    const fileContent = fs.readFileSync(file);
    result.set(basename, Handlebars.compile(fileContent.toString()));

    log.log(`Template loaded success "${file}" (${Date.now() - startTime} ms)`);
  }

  log.log(`All templates loaded (${Date.now() - globalStartTime} ms)`);
  return result;
};

export const TextTemplates: Map<string, HandlebarsTemplateDelegate> = loadTemplates();

Handlebars.registerHelper('equals', (a, b, opts) => {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});
