/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-empty */

export const loadPolyfill = () => {
  if (!Intl?.DisplayNames) {
    require(`@formatjs/intl-displaynames/polyfill`);
  }
  //@ts-ignore
  if (!Intl?.ListFormat) {
    require(`@formatjs/intl-listformat/polyfill-force`);
  }
  if (!Intl?.NumberFormat) {
    require(`@formatjs/intl-numberformat/polyfill`);
  }

  if (!Intl?.PluralRules) {
    require(`@formatjs/intl-pluralrules/polyfill`);
  }
};

export const loadPolyfillData = (lang: string) => {
  //Load Lang polyfill
  try {
    if (!Intl?.DisplayNames) {
      require(`@formatjs/intl-displaynames/locale-data/${lang}`);
    }
  } catch (error) {}

  try {
    //@ts-ignore
    if (!Intl?.ListFormat) {
      require(`@formatjs/intl-listformat/locale-data/${lang}`);
    }
  } catch (error) {}

  try {
    if (!Intl?.NumberFormat) {
      require(`@formatjs/intl-numberformat/locale-data/${lang}`);
    }
  } catch (error) {}

  try {
    if (!Intl?.PluralRules) {
      require(`@formatjs/intl-pluralrules/locale-data/${lang}`);
    }
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
