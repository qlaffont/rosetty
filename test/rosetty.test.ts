/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatDuration,
  formatRelative,
  subDays,
} from 'date-fns';

import { locales, rosetty } from '../src';

describe('rosetty', () => {
  it('works', () => {
    expect(rosetty).toBeDefined();
  });

  it('should return an error if no data is precise', () => {
    expect(() => {
      //@ts-ignore
      return rosetty();
    }).toThrowError(
      'rosetty: data must be an object with at least one language'
    );
  });

  describe('getCurrentLang', () => {
    it('should return current lang', () => {
      const { enGB: enLocale, fr: frLocale } = locales;
      const r = rosetty(
        {
          en: {
            dict: {},
            locale: enLocale,
          },
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'en'
      );

      expect(r.getCurrentLang()).toBe('en');
    });

    it('should return undefined if no lang is defined', () => {
      const { enGB: enLocale, fr: frLocale } = locales;
      const r = rosetty({
        en: {
          dict: {},
          locale: enLocale,
        },
        fr: {
          dict: {},
          locale: frLocale,
        },
      });

      expect(r.getCurrentLang()).toBe(undefined);
    });
  });

  describe('languages', () => {
    it('should return only languages who is conform', () => {
      const { enGB: enLocale } = locales;
      const r = rosetty({
        en: {
          dict: {},
          locale: enLocale,
        },
        //@ts-ignore
        fr: {
          dict: {},
        },
      });

      expect(r.languages).toEqual(['en']);
    });
  });

  describe('changeLang', () => {
    it('should be able to change current lang', () => {
      const { enGB: enLocale, fr: frLocale } = locales;
      const r = rosetty(
        {
          en: {
            dict: {},
            locale: enLocale,
          },
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'en'
      );

      expect(r.getCurrentLang()).toBe('en');
      r.changeLang('fr');
      expect(r.getCurrentLang()).toBe('fr');
      expect(r.languages).toEqual(['en', 'fr']);
    });

    it("should throw an error if lang doesn't exist", () => {
      const { enGB: enLocale, fr: frLocale } = locales;
      const r = rosetty(
        {
          en: {
            dict: {},
            locale: enLocale,
          },
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'en'
      );

      expect(() => {
        r.changeLang('es');
      }).toThrowError('rosetty: language es not found');
    });
  });

  // Rosetta tests

  describe('t', () => {
    it('should return translated text', () => {
      const { enGB: enLocale } = locales;
      const r = rosetty<{ test: 'toto' }>(
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

      expect(r.t('test')).toEqual('This is a test');
    });

    it('should return translated text with data', () => {
      const { enGB: enLocale } = locales;
      const r = rosetty<{ test: 'toto' }>(
        {
          en: {
            dict: {
              test: 'This is a {{firstName}}',
            },
            locale: enLocale,
          },
        },
        'en'
      );

      expect(
        r.t('test', {
          firstName: 'test',
        })
      ).toEqual('This is a test');
    });

    it('should be able to allow autocomplete for ts', () => {
      const { enGB: enLocale } = locales;
      const r = rosetty<{ test: ''; toto: { titi: '' } }>(
        {
          en: {
            dict: {
              test: 'This is a {{firstName}}',
              toto: {
                titi: 'toto',
              },
            },
            locale: enLocale,
          },
        },
        'en'
      );

      //@ts-expect-error
      r.t('wrongekeytocheckautocomplete');

      expect(
        r.t('test', {
          firstName: 'test',
        })
      ).toEqual('This is a test');
      expect(r.t('toto.titi')).toEqual('toto');
    });
  });

  // Format JS tests

  describe('displayNames', () => {
    it('should return same value as Intl', () => {
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.displayNames('fr', { type: 'language' })).toEqual(
        new Intl.DisplayNames(['fr'], { type: 'language' }).of('fr')
      );
    });
  });

  describe('listFormat', () => {
    it('should return same value as Intl', () => {
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.listFormat(['a', 'b', 'c'], { type: 'unit' })).toEqual(
        //@ts-ignore
        new Intl.ListFormat('fr', { type: 'unit' }).format(['a', 'b', 'c'])
      );
    });
  });

  describe('numberFormat', () => {
    it('should return same value as Intl', () => {
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(
        r.numberFormat(1230, {
          style: 'currency',
          currencySign: 'accounting',
          currency: 'EUR',
        })
      ).toEqual(
        //@ts-ignore
        new Intl.NumberFormat('fr', {
          style: 'currency',
          currencySign: 'accounting',
          currency: 'EUR',
        }).format(1230)
      );
    });
  });

  describe('pluralRules', () => {
    it('should return same value as Intl', () => {
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.pluralRules(2, { type: 'ordinal' })).toEqual(
        //@ts-ignore
        new Intl.PluralRules('fr', { type: 'ordinal' }).select(2)
      );
    });
  });

  // Date FNS tests
  describe('format', () => {
    it('should return same value as Date fns', () => {
      const dateToTest = new Date();
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.format(dateToTest, 'yyyy-MM-dd')).toEqual(
        format(dateToTest, 'yyyy-MM-dd', { locale: frLocale })
      );
    });
  });

  describe('formatRelative', () => {
    it('should return same value as Date fns', () => {
      const dateToTest = new Date();
      const yesterdayDate = subDays(dateToTest, 1);
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.formatRelative(dateToTest, yesterdayDate)).toEqual(
        formatRelative(dateToTest, yesterdayDate, { locale: frLocale })
      );
    });
  });

  describe('formatDistance', () => {
    it('should return same value as Date fns', () => {
      const dateToTest = new Date();
      const yesterdayDate = subDays(dateToTest, 1);
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.formatDistance(dateToTest, yesterdayDate)).toEqual(
        formatDistance(dateToTest, yesterdayDate, { locale: frLocale })
      );
    });
  });

  describe('formatDistanceToNow', () => {
    it('should return same value as Date fns', () => {
      const yesterdayDate = subDays(new Date(), 1);
      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.formatDistanceToNow(yesterdayDate)).toEqual(
        formatDistanceToNow(yesterdayDate, { locale: frLocale })
      );
    });
  });

  describe('formatDuration', () => {
    it('should return same value as Date fns', () => {
      const duration = {
        years: 2,
        months: 9,
        weeks: 1,
        days: 7,
        hours: 5,
        minutes: 9,
        seconds: 30,
      };

      const { fr: frLocale } = locales;
      const r = rosetty(
        {
          fr: {
            dict: {},
            locale: frLocale,
          },
        },
        'fr'
      );

      expect(r.formatDuration(duration)).toEqual(
        formatDuration(duration, { locale: frLocale })
      );
    });
  });
});
