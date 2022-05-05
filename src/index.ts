/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatDuration,
  formatRelative,
} from 'date-fns';
import * as dateFNSLocaleFiles from 'date-fns/locale';
import rosetta from 'rosetta';

import {
  DisplayNamesOptions,
  IntlListFormatOptions,
  Language as LanguageType,
  Locales,
  NumberFormatOptions,
  RosettyReturn as RosettyReturnType,
} from './types';

export const locales: Locales = dateFNSLocaleFiles;

export type RosettyReturn<T> = RosettyReturnType<T>;
export type Language = LanguageType;

export const rosetty = <T>(
  initialConfig: Record<string, LanguageType>,
  defaultLang?: string
): RosettyReturnType<T> => {
  let config: Record<string, LanguageType> = initialConfig;
  let actualConfig: LanguageType | undefined;
  let actualLang: string | undefined;

  if (typeof initialConfig !== 'object') {
    throw new Error(
      'rosetty: data must be an object with at least one language'
    );
  }

  //Filter only languages who respect config format
  config = Object.keys(config).reduce(
    (acc: Record<string, LanguageType>, lang) => {
      if (
        typeof config[lang] === 'object' &&
        typeof config[lang].dict === 'object' &&
        typeof config[lang].locale === 'object'
      ) {
        acc[lang] = config[lang];
      }
      return acc;
    },
    {}
  );

  const rosettaInstance = rosetta(
    Object.entries(config)
      ?.map(([key, value]) => [key, value.dict])
      ?.reduce(
        (prev, [key, value]) => ({ ...prev, [key as string]: value }),
        {}
      )
  );

  const changeLang = (lang: string) => {
    const langConfig = config[lang];
    if (!langConfig) {
      throw new Error(`rosetty: language ${lang} not found`);
    }

    actualConfig = config[lang];
    actualLang = lang;
    rosettaInstance.locale(lang);
  };

  if (defaultLang) {
    changeLang(defaultLang);
  }

  return {
    changeLang,
    languages: Object.keys(config),
    getCurrentLang: () => actualLang,
    //Rosetta
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    t: (key: ObjectPath<T>, params?: Record<string, any>) =>
      actualLang
        ? rosettaInstance.t(key as unknown as string, params)
        : undefined,
    //Intl Polyfill
    displayNames: (langCode: string, options: Partial<DisplayNamesOptions>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.DisplayNames(
        [actualConfig?.locale.code as string],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        options
      ).of(langCode);
    },
    listFormat: (list: string[], options: Partial<IntlListFormatOptions>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.ListFormat(actualConfig?.locale.code, options).format(
        list
      );
    },
    numberFormat: (value: number, options: Partial<NumberFormatOptions>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.NumberFormat(actualConfig?.locale.code, options).format(
        value
      );
    },
    pluralRules: (
      value: number,
      options: {
        type: 'cardinal' | 'ordinal';
      }
    ) => {
      return new Intl.PluralRules(actualConfig?.locale.code, options).select(
        value
      );
    },
    //Date FNS i18n
    format: (
      date: number | Date,
      stringFormat: string,
      options: {
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        firstWeekContainsDate?: number;
        useAdditionalWeekYearTokens?: boolean;
        useAdditionalDayOfYearTokens?: boolean;
      } = {}
    ) =>
      format(date, stringFormat, { ...options, locale: actualConfig!.locale }),
    formatRelative: (
      date: number | Date,
      baseDate: number | Date,
      options: {
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      } = {}
    ) =>
      formatRelative(date, baseDate, {
        ...options,
        locale: actualConfig!.locale,
      }),
    formatDistance: (
      date: number | Date,
      baseDate: number | Date,
      options: {
        includeSeconds?: boolean;
        addSuffix?: boolean;
      } = {}
    ) =>
      formatDistance(date, baseDate, {
        ...options,
        locale: actualConfig!.locale,
      }),
    formatDistanceToNow: (
      date: number | Date,
      options: {
        includeSeconds?: boolean;
        addSuffix?: boolean;
      } = {}
    ) =>
      formatDistanceToNow(date, { ...options, locale: actualConfig!.locale }),
    formatDuration: (
      duration: Duration,
      options: {
        format?: string[];
        zero?: boolean;
        delimiter?: string;
      } = {}
    ) => formatDuration(duration, { ...options, locale: actualConfig!.locale }),
  };
};
