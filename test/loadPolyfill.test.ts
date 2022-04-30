/* eslint-disable @typescript-eslint/ban-ts-comment */
import { loadNodePolyfill } from '../src';

describe('loadNodePolyfill', () => {
  it('works', () => {
    expect(loadNodePolyfill).toBeDefined();
  });

  it('should load polyfill', () => {
    //@ts-ignore
    Intl.DisplayNames = undefined;
    expect(Intl.DisplayNames).toBe(undefined);
    loadNodePolyfill(['fr']);
    expect(Intl.DisplayNames).not.toBe(undefined);
  });
});
