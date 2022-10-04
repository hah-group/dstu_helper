import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Logger, Type } from '@nestjs/common';
import { glob } from 'glob';
import { BaseHelper } from './helper/base.helper';
import { EqualsHelper } from './helper/equals.helper';
import { TimeHelper } from './helper/time.helper';
import { LessonDestinationHelper } from './helper/lesson-destination.helper';
import * as basicHelpers from 'handlebars-helpers';
import { LessonTypeHelper } from './helper/lesson-type.helper';
import { RenderDestinationHelper } from './helper/render-destination.helper';
import { RelativeDateHelper } from './helper/relative-date.helper';
import { DateButtonHelper } from './helper/date-button.helper';

const helpers: Type<BaseHelper>[] = [
  TimeHelper,
  LessonDestinationHelper,
  LessonTypeHelper,
  RenderDestinationHelper,
  RelativeDateHelper,
  DateButtonHelper,
];
const log = new Logger('TextTemplate');

const loadTemplates: () => Map<string, HandlebarsTemplateDelegate> = () => {
  const filesPath = path.join(process.cwd(), 'dist', '**', `*.hbs`);
  let files = glob.sync(filesPath);
  files = files.filter((path) => path.indexOf('partial') == -1);

  log.log(`Start loading templates`);
  const globalStartTime = Date.now();

  const result: Map<string, HandlebarsTemplateDelegate> = new Map();
  for (const file of files) {
    const fileName = path.basename(file);
    const startTime = Date.now();

    const basename = fileName.split('.')[0];
    const fileContent = fs.readFileSync(file);
    result.set(basename, Handlebars.compile(fileContent.toString()));

    log.log(`Template loaded "${fileName}" (${Date.now() - startTime} ms)`);
  }

  log.log(`All templates loaded (${Date.now() - globalStartTime} ms)`);
  return result;
};

const loadPartials: () => void = () => {
  const filesPath = path.join(process.cwd(), 'dist', '**', `*.partial.hbs`);
  const files = glob.sync(filesPath);

  log.log(`Start loading partials`);
  const globalStartTime = Date.now();

  for (const file of files) {
    const fileName = path.basename(file);
    const startTime = Date.now();

    const basename = fileName.split('.')[0];
    const fileContent = fs.readFileSync(file);
    Handlebars.registerPartial(basename, fileContent.toString());

    log.log(`Partial loaded "${fileName}" (${Date.now() - startTime} ms)`);
  }

  log.log(`All partials loaded (${Date.now() - globalStartTime} ms)`);
};

const registerHelpers = () => {
  helpers.forEach((helper) => {
    log.log(`Register helper: "${helper.name}"`);
    new helper().register();
  });
  for (const entry of Object.entries(basicHelpers())) {
    Handlebars.registerHelper(entry[0], entry[1]);
  }
};

export const TextTemplates: Map<string, HandlebarsTemplateDelegate> = loadTemplates();
registerHelpers();
loadPartials();
