/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Locale } from 'date-fns';
import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatDuration,
  formatRelative,
} from 'date-fns';
import rosetta from 'rosetta';

type BreakDownObject<O, R = void> = {
  [K in keyof O as string]: K extends string
    ? R extends string
      ? ObjectDotNotation<O[K], `${R}.${K}`>
      : ObjectDotNotation<O[K], K>
    : never;
};

export type ObjectDotNotation<O, R = void> = O extends string
  ? R extends string
    ? R
    : never
  : BreakDownObject<O, R>[keyof BreakDownObject<O, R>];

export interface Language {
  dict: Record<string, unknown>;
  locale: Locale;
}

export interface RosettyReturn<T> {
  changeLang: (lang: string) => void;
  languages: string[];
  getCurrentLang: () => string | undefined;
  t: <R>(
    key: keyof R extends keyof T ? ObjectDotNotation<T> : ObjectDotNotation<R>,
    params?: Record<string, any>,
    dict?: Record<string, R>
  ) => string | undefined;
  displayNames: (
    langCode: string,
    options: Intl.DisplayNamesOptions
  ) => string | undefined;
  listFormat: (
    list: string[],
    options: Intl.ListFormatOptions
  ) => string | undefined;
  numberFormat: (
    value: number,
    options: Intl.NumberFormatOptions
  ) => string | undefined;
  pluralRules: (
    value: number,
    options: Intl.PluralRulesOptions
  ) => string | undefined;
  format: (
    date: number | Date,
    stringFormat: string,
    options?: Parameters<typeof format>[2]
  ) => string;
  formatRelative: (
    date: number | Date,
    baseDate: number | Date,
    options?: Parameters<typeof formatRelative>[2]
  ) => string;
  formatDistance: (
    date: number | Date,
    baseDate: number | Date,
    options?: Parameters<typeof formatDistance>[2]
  ) => string;
  formatDistanceToNow: (
    date: number | Date,
    options?: Parameters<typeof formatDistanceToNow>[1]
  ) => string;
  formatDuration: (
    duration: object,
    options?: Parameters<typeof formatDuration>[1]
  ) => string;
}

export const rosetty = <T>(
  initialConfig: Record<string, Language>,
  defaultLang?: string,
  translateFallback?: boolean
): RosettyReturn<T> => {
  let config: Record<string, Language> = initialConfig;
  let actualConfig: Language | undefined;
  let actualLang: string | undefined;

  if (typeof initialConfig !== 'object') {
    throw new Error(
      'rosetty: data must be an object with at least one language'
    );
  }

  //Filter only languages who respect config format
  config = Object.keys(config).reduce((acc: Record<string, Language>, lang) => {
    if (
      typeof config[lang] === 'object' &&
      typeof config[lang].dict === 'object' &&
      typeof config[lang].locale === 'object'
    ) {
      acc[lang] = config[lang];
    }
    return acc;
  }, {});

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
    //@ts-ignore
    t: <R>(key, params?: Record<string, any>, dict?: Record<string, R>) => {
      if (actualLang) {
        if (dict) {
          const r = rosetta(dict);
          r.locale(actualLang);
          return (
            r.t(key as unknown as string, params) ||
            (translateFallback ? key : undefined)
          );
        } else {
          return (
            rosettaInstance.t(key as unknown as string, params) ||
            (translateFallback ? key : undefined)
          );
        }
      } else {
        return translateFallback ? key : undefined;
      }
    },
    //Intl Polyfill
    displayNames: (langCode: string, options: Intl.DisplayNamesOptions) => {
      return new Intl.DisplayNames(
        [actualConfig?.locale.code as string],
        options
      ).of(langCode);
    },
    listFormat: (list: string[], options: Intl.ListFormatOptions) => {
      return new Intl.ListFormat(actualConfig?.locale.code, options).format(
        list
      );
    },
    numberFormat: (value: number, options: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(actualConfig?.locale.code, options).format(
        value
      );
    },
    pluralRules: (value: number, options: Intl.PluralRulesOptions) => {
      return new Intl.PluralRules(actualConfig?.locale.code, options).select(
        value
      );
    },
    //Date FNS i18n
    format: (
      date: number | Date,
      stringFormat: string,
      options?: Parameters<typeof format>[2]
    ) =>
      format(date, stringFormat, { ...options, locale: actualConfig!.locale }),
    formatRelative: (
      date: number | Date,
      baseDate: number | Date,
      options?: Parameters<typeof formatRelative>[2]
    ) =>
      formatRelative(date, baseDate, {
        ...options,
        locale: actualConfig!.locale,
      }),
    formatDistance: (
      date: number | Date,
      baseDate: number | Date,
      options?: Parameters<typeof formatDistance>[2]
    ) =>
      formatDistance(date, baseDate, {
        ...options,
        locale: actualConfig!.locale,
      }),
    formatDistanceToNow: (
      date: number | Date,
      options?: Parameters<typeof formatDistanceToNow>[1]
    ) =>
      formatDistanceToNow(date, { ...options, locale: actualConfig!.locale }),
    formatDuration: (
      duration: object,
      options?: Parameters<typeof formatDuration>[1]
    ) => formatDuration(duration, { ...options, locale: actualConfig!.locale }),
  };
};
