import * as dateFNSLocaleFiles from 'date-fns/locale';

import { locales } from '../src';

describe('locales', () => {
  it('works', () => {
    expect(locales).toBeDefined();
  });

  it('has all locales', () => {
    expect(Object.keys(locales).length).toBe(
      Object.keys(dateFNSLocaleFiles).length
    );
  });

  it('return locale class', () => {
    expect(locales.fr).toBeDefined();
    expect(locales.fr).toBe(dateFNSLocaleFiles.fr);
    expect(typeof locales.fr).toBe('object');
  });
});
