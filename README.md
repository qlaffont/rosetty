[![Maintainability](https://api.codeclimate.com/v1/badges/1ff0c28615640d86e758/maintainability)](https://codeclimate.com/github/qlaffont/rosetty/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/1ff0c28615640d86e758/test_coverage)](https://codeclimate.com/github/qlaffont/rosetty/test_coverage) ![npm](https://img.shields.io/npm/v/rosetty) ![npm](https://img.shields.io/npm/dm/rosetty) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/rosetty) ![NPM](https://img.shields.io/npm/l/rosetty)

# Rosetty

Complete Intl/I18n solution for browser and node. Old Owner: [@flexper](https://github.com/flexper)

- React Implementation : [Rosetty React](https://github.com/qlaffont/rosetty-react)

## Usage

```js
const { rosetty } = require('rosetty');

const r = rosetty(
  {
    en: {
      dict: {
        test: 'This is a test',
      },
      locale: 'en-GB',
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
| config            | Record<string, Language> | Specify dictionary and locale to use for each lang             |
| defaultLang       | string?                  | Specify default language to use (should be the same as config) |
| translateFallback | boolean?                 | Return fallback if translation is not defined                  |

**Return**

| Field Name         | Type                                                                                                                             | Description                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| changeLang         | (newLang: string) => void                                                                                                        | Change current lang                                                                                                       |
| languages          | string[]                                                                                                                         | List of languages who can be selected                                                                                     |
| getCurrentLang     | () => string                                                                                                                     | Return current lang                                                                                                       |
| t                  | (key: string, params?: Record<string, any>, dict?: Record<string, any>) => string OR undefined                                   | Return translated text <https://github.com/lukeed/rosetta#rosettatkey-params-lang>. If dict is defined, he will use dict. |
| displayNames       | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames) | Consistent translation of language, region and script display names                                                       |
| listFormat         | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat)     | Language-sensitive list formatting                                                                                        |
| numberFormat       | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) | Language-sensitive number formatting                                                                                      |
| pluralRules        | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules)   | Plural-sensitive formatting and plural-related language rules                                                             |
| dateTimeFormat     | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)            | Language-sensitive date and time formatting                                                                               |
| relativeTimeFormat | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)        | Language-sensitive relative time formatting                                                                               |
| collator           | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator)                  | Language-sensitive string comparison                                                                                      |
| segmenter          | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)                 | Language-sensitive text segmentation                                                                                      |
| durationFormat     | [Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat)            | Language-sensitive duration formatting (Experimental)                                                                     |

### Locale Configuration

The `locale` field in the configuration should be a valid BCP 47 language tag (e.g., 'en-GB', 'fr', 'de-DE') or an Intl.Locale instance.

```js
// Using string locale
const config = {
  en: {
    dict: {},
    locale: 'en-GB'
  }
};

// Using Intl.Locale
const config = {
  en: {
    dict: {},
    locale: new Intl.Locale('en-GB')
  }
};
```

### Polyfill Support (Node.JS OR Browser)

To use this library, you maybe need to add polyfills as some features are still experimental.

To fix this :

- Install [missing polyfills](https://formatjs.github.io/docs/polyfills)
- Use [polyfill-fastly.io](https://polyfill-fastly.io/) to get the polyfills
- Use your bundler to import the polyfills (webpack, [vite](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), etc).

## Maintain

This package use [TSdx](https://github.com/jaredpalmer/tsdx). Please check documentation to update this package.
