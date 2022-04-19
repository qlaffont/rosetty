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
