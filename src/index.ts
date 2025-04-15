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
  locale: Intl.UnicodeBCP47LocaleIdentifier | Intl.Locale;
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
  dateTimeFormat: (
    value: number | Date,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  relativeTimeFormat: (
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions
  ) => string;
  collator: (
    str1: string,
    str2: string,
    options?: Intl.CollatorOptions
  ) => number;
  segmenter: (input: string, options?: Intl.SegmenterOptions) => Intl.Segments;
  //TODO : To replace https://github.com/microsoft/TypeScript/issues/60608
  durationFormat: (
    duration: {
      years?: number;
      months?: number;
      weeks?: number;
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
      milliseconds?: number;
    },
    options?: {
      style?: 'long' | 'short' | 'narrow' | 'digital';
      years?: 'numeric' | '2-digit' | 'none';
      months?: 'numeric' | '2-digit' | 'none';
      weeks?: 'numeric' | '2-digit' | 'none';
      days?: 'numeric' | '2-digit' | 'none';
      hours?: 'numeric' | '2-digit' | 'none';
      minutes?: 'numeric' | '2-digit' | 'none';
      seconds?: 'numeric' | '2-digit' | 'none';
      milliseconds?: 'numeric' | 'none';
      fractionalDigits?: number;
    }
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
      typeof config[lang].locale !== 'undefined'
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
    console.log(config, lang);
    if (!langConfig) {
      throw new Error(`rosetty: language ${lang} not found`);
    }

    actualConfig = config[lang];
    actualLang = lang;
    rosettaInstance.locale(lang);
  };

  const getLocale = () => {
    return typeof actualConfig!.locale === 'string'
      ? actualConfig!.locale
      : actualConfig!.locale.toString();
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
      return new Intl.DisplayNames([getLocale()], options).of(langCode);
    },
    listFormat: (list: string[], options: Intl.ListFormatOptions) => {
      return new Intl.ListFormat(getLocale(), options).format(list);
    },
    numberFormat: (value: number, options: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(getLocale(), options).format(value);
    },
    pluralRules: (value: number, options: Intl.PluralRulesOptions) => {
      return new Intl.PluralRules(getLocale(), options).select(value);
    },
    dateTimeFormat: (
      value: number | Date,
      options?: Intl.DateTimeFormatOptions
    ) => {
      return new Intl.DateTimeFormat(getLocale(), options).format(value);
    },
    relativeTimeFormat: (
      value: number,
      unit: Intl.RelativeTimeFormatUnit,
      options?: Intl.RelativeTimeFormatOptions
    ) => {
      return new Intl.RelativeTimeFormat(getLocale(), options).format(
        value,
        unit
      );
    },
    collator: (str1: string, str2: string, options?: Intl.CollatorOptions) => {
      return new Intl.Collator(getLocale(), options).compare(str1, str2);
    },
    segmenter: (input: string, options?: Intl.SegmenterOptions) => {
      return new Intl.Segmenter(getLocale(), options).segment(input);
    },
    durationFormat: (duration, options) => {
      // @ts-ignore - DurationFormat is new and might not be in TS lib yet
      return new Intl.DurationFormat(getLocale(), options).format(duration);
    },
  };
};
