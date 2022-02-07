import * as i18nSource from 'i18n';

export type i18nReplacements = any;

export const localization = (phrase: string, locale: string, replacements: i18nReplacements): string => {
  return i18nSource.__(
    {
      phrase: phrase,
      locale: locale,
    },
    replacements,
  );
};
