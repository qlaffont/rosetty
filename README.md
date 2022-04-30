[![Maintainability](https://api.codeclimate.com/v1/badges/1ff0c28615640d86e758/maintainability)](https://codeclimate.com/github/flexper/rosetty/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/1ff0c28615640d86e758/test_coverage)](https://codeclimate.com/github/flexper/rosetty/test_coverage) ![npm](https://img.shields.io/npm/v/rosetty) ![npm](https://img.shields.io/npm/dm/rosetty) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/rosetty) ![NPM](https://img.shields.io/npm/l/rosetty)

# Rosetty

Complete Intl/I18n solution for browser and node

- React Implementation : [Rosetty React](https://github.com/flexper/rosetty-react)

## Usage

```js
const { rosetty, locales } = require('rosetty');

const { enGB: enLocale } = locales;

const r = rosetty(
  {
    en: {
      dict: {
        test: 'This is a test',
      },
      locale: enLocale,
    },
  },
  'en'
);

console.log(r.t('test')); // This is a test
```

## API

### rosetty(config, defaultLang?)

**Options**

| Field Name  | Type                     | Description                                                    |
| ----------- | ------------------------ | -------------------------------------------------------------- |
| config      | Record<string, Language> | Specify dictionnary and locale to use for each lang            |
| defaultLang | string?                  | Specify default language to use (should be the same as config) |

**Return**

| Field Name          | Type                                                                                                                             | Description                                                                                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| changeLang          | (newLang: string) => void                                                                                                        | Change current lang                                                                                                                                                                   |
| languages           | string[]                                                                                                                         | List of languages who can be selected                                                                                                                                                 |
| getCurrentLang      | () => string                                                                                                                     | Return current lang                                                                                                                                                                   |
| t                   | (key: string, params?: Record<string, any>) => string OR undefined                                                               | Return translated text <https://github.com/lukeed/rosetta#rosettatkey-params-lang>                                                                                                    |
| displayNames        | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames) | Consistent translation of language, region and script display names <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames> |
| listFormat          | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat)     | Language-sensitive list formatting <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat>                                      |
| numberFormat        | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) | Language-sensitive list formatting <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat>                                  |
| pluralRules         | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules)   | Plural-sensitive formatting and plural-related language rules <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules>         |
| format              | [Documentation](https://date-fns.org/v2.28.0/docs/format)                                                                        | Return the formatted date string in the given format <https://date-fns.org/v2.28.0/docs/format>                                                                                       |
| formatRelative      | [Documentation](https://date-fns.org/v2.28.0/docs/formatRelative)                                                                | Represent the date in words relative to the given base date. <https://date-fns.org/v2.28.0/docs/formatRelative>                                                                       |
| formatDistance      | [Documentation](https://date-fns.org/v2.28.0/docs/formatDistance)                                                                | Return the distance between the given dates in words. <https://date-fns.org/v2.28.0/docs/formatDistance>                                                                              |
| formatDistanceToNow | [Documentation](https://date-fns.org/v2.28.0/docs/formatDistanceToNow)                                                           | Return the distance between the given date and now in words. <https://date-fns.org/v2.28.0/docs/formatDistanceToNow>                                                                  |
| formatDuration      | [Documentation](https://date-fns.org/v2.28.0/docs/formatDuration)                                                                | Return human-readable duration string i.e. "9 months 2 days" <https://date-fns.org/v2.28.0/docs/formatDuration>                                                                       |

### locales

Return: Record<string, Locale>

Return Date-fns locale files. <https://date-fns.org/v2.28.0/docs/Locale>

### WARNING FOR NODE JS ENVIRONMENT

**You need to load polyfill on node environment because Intl API is not present. Please use below code to make it works.**

```js
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-empty */

export const loadPolyfill = () => {
  //@ts-ignore
  if (!Intl?.DisplayNames) {
    require(`@formatjs/intl-displaynames/polyfill`);
  }
  //@ts-ignore
  if (!Intl?.ListFormat) {
    require(`@formatjs/intl-listformat/polyfill-force`);
  }
  //@ts-ignore
  if (!Intl?.NumberFormat) {
    require(`@formatjs/intl-numberformat/polyfill`);
  }
  //@ts-ignore
  if (!Intl?.PluralRules) {
    require(`@formatjs/intl-pluralrules/polyfill`);
  }
};

export const loadPolyfillData = (lang: string) => {
  //Load Lang polyfill
  try {
    require(`@formatjs/intl-displaynames/locale-data/${lang}`);
  } catch (error) {}

  try {
    require(`@formatjs/intl-listformat/locale-data/${lang}`);
  } catch (error) {}

  try {
    require(`@formatjs/intl-numberformat/locale-data/${lang}`);
  } catch (error) {}

  try {
    require(`@formatjs/intl-pluralrules/locale-data/${lang}`);
  } catch (error) {}

  //Load Lang polyfill fallback
  try {
    require(`@formatjs/intl-displaynames/locale-data/${lang.split('-')[0]}`);
  } catch (error) {}

  try {
    require(`@formatjs/intl-listformat/locale-data/${lang.split('-')[0]}`);
  } catch (error) {}

  try {
    require(`@formatjs/intl-numberformat/locale-data/${lang.split('-')[0]}`);
  } catch (error) {}

  try {
    require(`@formatjs/intl-pluralrules/locale-data/${lang.split('-')[0]}`);
  } catch (error) {}
};

```

## Maintain

This package use [TSdx](https://github.com/jaredpalmer/tsdx). Please check documentation to update this package.
