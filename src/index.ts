/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatDuration,
  formatRelative,
} from 'date-fns';
import { Locale } from 'date-fns';
import * as dateFNSLocaleFiles from 'date-fns/locale';
import rosetta from 'rosetta';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;

//@ts-ignore
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

export interface Locales {
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

export interface Language {
  dict: Record<string, unknown>;
  locale: Locale;
}

export interface RosettyReturn<T extends AnyObject> {
  changeLang: (lang: string) => void;
  languages: string[];
  getCurrentLang: () => string | undefined;
  t: (key: ObjectPath<T>, params?: Record<string, any>) => string | undefined;
  displayNames: (
    langCode: string,
    options: Partial<DisplayNamesOptions>
  ) => string | undefined;
  listFormat: (
    list: string[],
    options: Partial<IntlListFormatOptions>
  ) => string | undefined;
  numberFormat: (
    value: number,
    options: Partial<NumberFormatOptions>
  ) => string | undefined;
  pluralRules: (
    value: number,
    options: {
      type: 'cardinal' | 'ordinal';
    }
  ) => string | undefined;
  format: (
    date: number | Date,
    stringFormat: string,
    options?: {
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: number;
      useAdditionalWeekYearTokens?: boolean;
      useAdditionalDayOfYearTokens?: boolean;
    }
  ) => string;
  formatRelative: (
    date: number | Date,
    baseDate: number | Date,
    options?: {
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }
  ) => string;
  formatDistance: (
    date: number | Date,
    baseDate: number | Date,
    options?: {
      includeSeconds?: boolean;
      addSuffix?: boolean;
    }
  ) => string;
  formatDistanceToNow: (
    date: number | Date,
    options?: {
      includeSeconds?: boolean;
      addSuffix?: boolean;
    }
  ) => string;
  formatDuration: (
    duration: Duration,
    options?: {
      format?: string[];
      zero?: boolean;
      delimiter?: string;
    }
  ) => string;
}

export interface DisplayNamesOptions {
  localeMatcher: 'lookup' | 'best fit';
  style: 'narrow' | 'short' | 'long';
  type:
    | 'calendar'
    | 'language'
    | 'region'
    | 'script'
    | 'currency'
    | 'dateTimeField';
  fallback: 'code' | 'none';
}

export interface IntlListFormatOptions {
  localeMatcher: 'lookup' | 'best fit';
  style: 'narrow' | 'short' | 'long';
  type: 'conjunction' | 'disjunction' | 'unit';
}

export interface NumberFormatOptions {
  compactDisplay: 'short' | 'long';
  currency: string;
  currencyDisplay: 'symbol' | 'code' | 'name' | 'narrowSymbol';
  currencySign: 'standard' | 'accounting';
  localeMatcher: 'lookup' | 'best fit';
  notation: 'standard' | 'scientific' | 'engineering' | 'compact';
  numberingSystem: string;
  signDisplay: 'auto' | 'always' | 'never' | 'negative' | 'exceptZero';
  style: 'decimal' | 'percent' | 'currency';
  unit: string;
  unitDisplay: 'long' | 'short' | 'narrow';
  useGrouping: 'always' | 'auto' | 'false' | 'true' | 'min2';
  roundingMode: 'ceil' | 'floor' | 'expand' | 'trunc';
  roundingPriority: 'auto' | 'morePrecision' | 'lessPrecision';
  roundingIncrement: number;
  trailingZeroDisplay: 'auto' | 'stripIfInteger' | 'lessPrecision';
  minimumIntegerDigits: number;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  minimumSignificantDigits: number;
  maximumSignificantDigits: number;
}

export const locales: Locales = dateFNSLocaleFiles;

export const rosetty = <T extends AnyObject>(
  initialConfig: Record<string, Language>,
  defaultLang?: string
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
