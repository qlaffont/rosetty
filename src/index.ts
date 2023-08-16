/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import rosetta from 'rosetta';
import DAYJS from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';

type BreakDownObject<O, R = void> = {
  [K in keyof O as string]: K extends string
    ? R extends string
      ? ObjectDotNotation<O[K], `${R}.${K}`>
      : ObjectDotNotation<O[K], K>
    : never;
};

const dayjs = DAYJS;
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(localizedFormat);

export type ObjectDotNotation<O, R = void> = O extends string
  ? R extends string
    ? R
    : never
  : BreakDownObject<O, R>[keyof BreakDownObject<O, R>];

export interface Language {
  dict: Record<string, unknown>;
  locale: ILocale;
}

export interface RosettyReturn<T> {
  changeLang: (lang: string) => void;
  languages: string[];
  getCurrentLang: () => string | undefined;
  t: (
    key: ObjectDotNotation<T>,
    params?: Record<string, any>
  ) => string | undefined;
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
  ) => string;
  formatRelative: (
    date: number | Date,
    baseDate: number | Date,
  ) => string;
  formatDistance: (
    date: number | Date,
    baseDate: number | Date,
  ) => string;
  formatDistanceToNow: (
    date: number | Date,
  ) => string;
  formatDuration: (
    duration: object,
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
  style: 'decimal' | 'percent' | 'currency' | 'unit';
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
    t: (key: ObjectDotNotation<T>, params?: Record<string, any>) =>
      actualLang
        ? rosettaInstance.t(key as unknown as string, params) ||
          (translateFallback ? key : undefined)
        : // eslint-disable-next-line prettier/prettier
        (translateFallback ? key : undefined),
    //Intl Polyfill
    displayNames: (langCode: string, options: Partial<DisplayNamesOptions>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.DisplayNames(
        [actualConfig?.locale.name as string],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        options
      ).of(langCode);
    },
    listFormat: (list: string[], options: Partial<IntlListFormatOptions>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.ListFormat(actualConfig?.locale.name, options).format(
        list
      );
    },
    numberFormat: (value: number, options: Partial<NumberFormatOptions>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return new Intl.NumberFormat(actualConfig?.locale.name, options).format(
        value
      );
    },
    pluralRules: (
      value: number,
      options: {
        type: 'cardinal' | 'ordinal';
      }
    ) => {
      return new Intl.PluralRules(actualConfig?.locale.name, options).select(
        value
      );
    },
    //Date FNS i18n
    format: (
      date: number | Date,
      stringFormat: string,

    ) =>
      dayjs(date).locale(actualConfig!.locale).format(stringFormat),
      /**
       * @deprecated Since version 2.0. Will be deleted in version 3.0. Use formatDistance instead.
       */
    formatRelative: (
      date: number | Date,
      baseDate: number | Date
    ) =>
      dayjs(date).locale(actualConfig!.locale).from(dayjs(baseDate), true),
    formatDistance: (
      date: number | Date,
      baseDate: number | Date
    ) =>
    dayjs(date).locale(actualConfig!.locale).from(dayjs(baseDate), true),
    formatDistanceToNow: (
      date: number | Date,
    ) =>
    dayjs(date).locale(actualConfig!.locale).fromNow(true),
    formatDuration: (
      duration: object,
    ) => dayjs.duration(duration).locale(actualConfig!.locale.name).humanize(),
  };
};
