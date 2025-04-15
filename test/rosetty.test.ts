/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, expect, it } from '@jest/globals';
import '@formatjs/intl-durationformat/polyfill';

import { rosetty } from '../src';

describe('rosetty', () => {
  it('works', () => {
    expect(rosetty).toBeDefined();
  });

  expect(() => {
    //@ts-ignore
    return rosetty();
  }).toThrowError('rosetty: data must be an object with at least one language');
});

describe('getCurrentLang', () => {
  it('should return current lang', () => {
    const r = rosetty(
      {
        en: {
          dict: {},
          locale: 'en-GB',
        },
        fr: {
          dict: {},
          locale: 'fr',
        },
      },
      'en'
    );

    expect(r.getCurrentLang()).toBe('en');
  });

  it('should return undefined if no lang is defined', () => {
    const r = rosetty({
      en: {
        dict: {},
        locale: 'en-GB',
      },
      fr: {
        dict: {},
        locale: 'fr',
      },
    });

    expect(r.getCurrentLang()).toBe(undefined);
  });
});

describe('languages', () => {
  it('should return only languages who is conform', () => {
    const r = rosetty({
      en: {
        dict: {},
        locale: 'en-GB',
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
    const r = rosetty(
      {
        en: {
          dict: {},
          locale: 'en-GB',
        },
        fr: {
          dict: {},
          locale: 'fr',
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
    const r = rosetty(
      {
        en: {
          dict: {},
          locale: 'en-GB',
        },
        fr: {
          dict: {},
          locale: 'fr',
        },
      },
      'en'
    );

    expect(() => {
      r.changeLang('es');
    }).toThrowError('rosetty: language es not found');
  });
});

describe('t', () => {
  it('should return translated text', () => {
    const r = rosetty<{ test: 'toto' }>(
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

    expect(r.t('test')).toEqual('This is a test');
  });

  it('should return translated text from custom dict', () => {
    const r = rosetty<{ test: 'toto' }>(
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

    expect(r.t('toto', {}, { en: { toto: 'this is a test' } })).toEqual(
      'this is a test'
    );
  });

  it('should be able to return fallback', () => {
    const r = rosetty<{ test: 'toto' }>(
      {
        en: {
          dict: {
            test: 'This is a test',
          },
          locale: 'en-GB',
        },
      },
      'en',
      true
    );

    //@ts-ignore
    expect(r.t('tuto.tyrt')).toEqual('tuto.tyrt');
  });

  it('should return translated text with data', () => {
    const r = rosetty<{ test: 'toto' }>(
      {
        en: {
          dict: {
            test: 'This is a {{firstName}}',
          },
          locale: 'en-GB',
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
    const r = rosetty<{ test: ''; toto: { titi: '' } }>(
      {
        en: {
          dict: {
            test: 'This is a {{firstName}}',
            toto: {
              titi: 'toto',
            },
          },
          locale: 'en-GB',
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

describe('Intl methods', () => {
  const r = rosetty(
    {
      en: {
        dict: {},
        locale: 'en-GB',
      },
    },
    'en'
  );

  it('should format dates and times', () => {
    const date = new Date('2024-03-20T12:00:00Z');
    expect(r.dateTimeFormat(date, { dateStyle: 'full' })).toMatch(/Wednesday/);
  });

  it('should format relative time', () => {
    expect(r.relativeTimeFormat(-1, 'day')).toBe('1 day ago');
  });

  it('should compare strings', () => {
    expect(r.collator('a', 'b')).toBe(-1);
  });

  it('should segment text', () => {
    const segments = r.segmenter('Hello, world!');
    expect(Array.from(segments).length).toBeGreaterThan(0);
  });

  it('should format durations', () => {
    const duration = {
      hours: 2,
      minutes: 30
    };
    
    expect(r.durationFormat(duration)).toMatch(/2.*30/);
  });
});
