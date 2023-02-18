import { BaseHelper } from '@dstu_helper/common';
import { Logger, Type } from '@nestjs/common';
import * as fs from 'fs';
import { glob } from 'glob';
import * as Handlebars from 'handlebars';
import * as basicHelpers from 'handlebars-helpers';
import * as path from 'path';

import { AppearanceValueHelper } from './helper/appearance-value.helper';
import { BooleanEmojiHelper } from './helper/boolean-emoji.helper';
import { DateButtonHelper } from './helper/date-button.helper';
import { IsNowLessonHelper } from './helper/is-now-lesson.helper';
import { LessonDestinationHelper } from './helper/lesson-destination.helper';
import { LessonTypeHelper } from './helper/lesson-type.helper';
import { RelativeDateHelper } from './helper/relative-date.helper';
import { SwitchHelper } from './helper/switch.helper';
import { TeacherHelper } from './helper/teacher.helper';
import { TimeHelper } from './helper/time.helper';
import { TimeIntervalHelper } from './helper/time-interval.helper';

const helpers: Type<BaseHelper>[] = [
  TimeHelper,
  LessonDestinationHelper,
  LessonTypeHelper,
  RelativeDateHelper,
  DateButtonHelper,
  IsNowLessonHelper,
  SwitchHelper,
  TeacherHelper,
  BooleanEmojiHelper,
  TimeIntervalHelper,
  AppearanceValueHelper,
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

    const basename = fileName.replace(/(.*)\..*$/g, '$1');
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
  log.log(`Start register helpers`);
  const globalStartTime = Date.now();

  helpers.forEach((helper) => {
    const startTime = Date.now();
    new helper().register();
    log.log(`Helper registered "${helper.name}" (${Date.now() - startTime} ms)`);
  });

  for (const entry of Object.entries(basicHelpers())) {
    Handlebars.registerHelper(entry[0], entry[1]);
  }

  log.log(`All helpers registered (${Date.now() - globalStartTime} ms)`);
};

export const ContentTemplates: Map<string, HandlebarsTemplateDelegate> = loadTemplates();
registerHelpers();
loadPartials();
