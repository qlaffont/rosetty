const { rosetty, locales } = require('rosetty');


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
