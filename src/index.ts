/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { NumberFormatOptions } from '@formatjs/ecma402-abstract';
import { DisplayNamesOptions } from '@formatjs/intl-displaynames';
import { IntlListFormatOptions } from '@formatjs/intl-listformat';
import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatDuration,
  formatRelative,
  Locale,
} from 'date-fns';
import * as dateFNSLocaleFiles from 'date-fns/locale';
import rosetta from 'rosetta';

import { loadPolyfill, loadPolyfillData } from './loadPolyfillData';

interface Language {
  dict: Record<string, unknown>;
  locale: Locale;
}

type AnyObject = Record<string, any>;

type NewType<A extends string, B extends string> = `${A}.${B}`;

type DotJoin<A extends string, B extends string> = A extends ''
  ? B
  : NewType<A, B>;

type DeepKeys<O extends AnyObject> = {
  [K in keyof O]: O[K] extends AnyObject ? K : never;
}[keyof O];

type ObjectPath<
  O extends AnyObject,
  P extends string = '',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  K extends string = keyof O
> = K extends DeepKeys<O>
  ? ObjectPath<O[K], DotJoin<P, K>>
  : /*************/ DotJoin<P, K>;

interface Locales {
  af: Locale;
  ar: Locale;
  arDZ: Locale;
  arEG: Locale;
  arMA: Locale;
  arSA: Locale;
  arTN: Locale;
  az: Locale;
  be: Locale;
  bg: Locale;
  bn: Locale;
  bs: Locale;
  ca: Locale;
  cs: Locale;
  cy: Locale;
  da: Locale;
  de: Locale;
  deAT: Locale;
  el: Locale;
  enAU: Locale;
  enCA: Locale;
  enGB: Locale;
  enIE: Locale;
  enIN: Locale;
  enNZ: Locale;
  enUS: Locale;
  enZA: Locale;
  eo: Locale;
  es: Locale;
  et: Locale;
  eu: Locale;
  faIR: Locale;
  fi: Locale;
  fil: Locale;
  fr: Locale;
  frCA: Locale;
  frCH: Locale;
  fy: Locale;
  gd: Locale;
  gl: Locale;
  gu: Locale;
  he: Locale;
  hi: Locale;
  hr: Locale;
  ht: Locale;
  hu: Locale;
  hy: Locale;
  id: Locale;
  is: Locale;
  it: Locale;
  ja: Locale;
  jaHira: Locale;
  ka: Locale;
  kk: Locale;
  km: Locale;
  kn: Locale;
  ko: Locale;
  lb: Locale;
  lt: Locale;
  lv: Locale;
  mk: Locale;
  mn: Locale;
  ms: Locale;
  mt: Locale;
  nb: Locale;
  nl: Locale;
  nlBE: Locale;
  nn: Locale;
  pl: Locale;
  pt: Locale;
  ptBR: Locale;
  ro: Locale;
  ru: Locale;
  sk: Locale;
  sl: Locale;
  sq: Locale;
  sr: Locale;
  srLatn: Locale;
  sv: Locale;
  ta: Locale;
  te: Locale;
  th: Locale;
  tr: Locale;
  ug: Locale;
  uk: Locale;
  uz: Locale;
  uzCyrl: Locale;
  vi: Locale;
  zhCN: Locale;
  zhHK: Locale;
  zhTW: Locale;
}

loadPolyfill();

export const locales: Locales = dateFNSLocaleFiles;

export const rosetty = <T>(
  initialConfig: Record<string, Language>,
  defaultLang?: string
) => {
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

    loadPolyfillData(lang);

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
    displayNames: (langCode: string, options: DisplayNamesOptions) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.DisplayNames(
        [actualConfig?.locale.code as string],
        options
      ).of(langCode);
    },
    listFormat: (list: string[], options: IntlListFormatOptions) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.ListFormat(actualConfig?.locale.code, options).format(
        list
      );
    },
    numberFormat: (value: number, options: NumberFormatOptions) => {
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
