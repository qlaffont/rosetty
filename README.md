[![Maintainability](https://api.codeclimate.com/v1/badges/1ff0c28615640d86e758/maintainability)](https://codeclimate.com/github/qlaffont/rosetty/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/1ff0c28615640d86e758/test_coverage)](https://codeclimate.com/github/qlaffont/rosetty/test_coverage) ![npm](https://img.shields.io/npm/v/rosetty) ![npm](https://img.shields.io/npm/dm/rosetty) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/rosetty) ![NPM](https://img.shields.io/npm/l/rosetty)

# Rosetty

Complete Intl/I18n solution for browser and node. Old Owner: [@flexper](https://github.com/flexper)

- React Implementation : [Rosetty React](https://github.com/qlaffont/rosetty-react)

## Usage

```js
const { rosetty } = require('rosetty');
const { enGB } = require('date-fns/locale');

const r = rosetty(
  {
    en: {
      dict: {
        test: 'This is a test',
      },
      locale: enGB,
    },
  },
  'en'
);

console.log(r.t('test')); // This is a test
```

## API

### rosetty(config, defaultLang?)

**Options**

| Field Name        | Type                     | Description                                                    |
| ----------------- | ------------------------ | -------------------------------------------------------------- |
| config            | Record<string, Language> | Specify dictionnary and locale to use for each lang            |
| defaultLang       | string?                  | Specify default language to use (should be the same as config) |
| translateFallback | boolean?                 | Return fallback if translation is not defined                  |

**Return**

| Field Name          | Type                                                                                                                             | Description                                                                                                                                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| changeLang          | (newLang: string) => void                                                                                                        | Change current lang                                                                                                                                                                   |
| languages           | string[]                                                                                                                         | List of languages who can be selected                                                                                                                                                 |
| getCurrentLang      | () => string                                                                                                                     | Return current lang                                                                                                                                                                   |
| t                   | (key: string, params?: Record<string, any>, dict?: Record<string, any>) => string OR undefined                                   | Return translated text <https://github.com/lukeed/rosetta#rosettatkey-params-lang>. If dict is defined, he will use dict.                                                             |
| displayNames        | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames) | Consistent translation of language, region and script display names <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames> |
| listFormat          | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat)     | Language-sensitive list formatting <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat>                                      |
| numberFormat        | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) | Language-sensitive list formatting <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat>                                  |
| pluralRules         | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules)   | Plural-sensitive formatting and plural-related language rules <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules>         |
| format              | [Documentation](https://date-fns.org/v3.3.0/docs/format)                                                                        | Return the formatted date string in the given format <https://date-fns.org/v3.3.0/docs/format>                                                                                       |
| formatRelative      | [Documentation](https://date-fns.org/v3.3.0/docs/formatRelative)                                                                | Represent the date in words relative to the given base date. <https://date-fns.org/v3.3.0/docs/formatRelative>                                                                       |
| formatDistance      | [Documentation](https://date-fns.org/v3.3.0/docs/formatDistance)                                                                | Return the distance between the given dates in words. <https://date-fns.org/v3.3.0/docs/formatDistance>                                                                              |
| formatDistanceToNow | [Documentation](https://date-fns.org/v3.3.0/docs/formatDistanceToNow)                                                           | Return the distance between the given date and now in words. <https://date-fns.org/v3.3.0/docs/formatDistanceToNow>                                                                  |
| formatDuration      | [Documentation](https://date-fns.org/v3.3.0/docs/formatDuration)                                                                | Return human-readable duration string i.e. "9 months 2 days" <https://date-fns.org/v3.3.0/docs/formatDuration>                                                                       |  |

### WARNING FOR LOCALE !

**You need to import locale from `date-fns` package.**

```js
const { enGB } = require('date-fns/locale');
```

## Maintain

This package use [TSdx](https://github.com/jaredpalmer/tsdx). Please check documentation to update this package.
