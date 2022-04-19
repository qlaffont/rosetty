/* eslint-disable no-empty */

export const loadPolyfillData = (lang: string) => {
  //Load Lang polyfill
  try {
    require(`@formatjs/intl-displaynames/locale-data/${lang}`);
  } catch (error) {}
  try {
    require(`@formatjs/intl-numberformat/locale-data/${lang}`);
  } catch (error) {}
  try {
    require(`@formatjs/intl-listformat/locale-data/${lang}`);
  } catch (error) {}

  //Load Lang polyfill
  try {
    require(`@formatjs/intl-displaynames/locale-data/${lang.split('-')[0]}`);
  } catch (error) {}
  try {
    require(`@formatjs/intl-numberformat/locale-data/${lang.split('-')[0]}`);
  } catch (error) {}
  try {
    require(`@formatjs/intl-listformat/locale-data/${lang.split('-')[0]}`);
  } catch (error) {}
};
