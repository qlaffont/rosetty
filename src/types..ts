import { NumberFormatOptions } from '@formatjs/ecma402-abstract';
import { DisplayNamesOptions } from '@formatjs/intl-displaynames';
import { IntlListFormatOptions } from '@formatjs/intl-listformat';
import { Locale } from 'date-fns';

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

export interface RosettyReturn<T> {
  changeLang: (lang: string) => void;
  languages: string[];
  getCurrentLang: () => string | undefined;
  t: (key: ObjectPath<T>, params?: Record<string, any>) => string | undefined;
  displayNames: (
    langCode: string,
    options: DisplayNamesOptions
  ) => string | undefined;
  listFormat: (
    list: string[],
    options: IntlListFormatOptions
  ) => string | undefined;
  numberFormat: (
    value: number,
    options: NumberFormatOptions
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
