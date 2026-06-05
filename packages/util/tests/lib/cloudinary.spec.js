import { vi, describe, it, expect, afterEach } from 'vitest';

import { parseUrl, getPublicId, getTransformations, getFormat } from '../../src/lib/cloudinary';

// Mock console.warn() so we can see when it's called
global.console = {
  ...global.console,
  warn: vi.fn()
}

describe('Cloudinary', () => {
  afterEach(() => {
    // Clears the state of console.warn, in case multiple tests want to monitor it
    vi.restoreAllMocks()
  });

  describe('parseUrl', () => {
    it('should throw an error on a Cloudinary URL without a version', () => {
      const publicId = 'turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/${publicId}`;
      expect(() => parseUrl(src)).toThrow('Invalid src: Does not include version')
    });

    it('should parse a full image Cloudinary URL with a single set of transformations', () => {
      const assetType = 'image';
      const cloudName = 'test-cloud';
      const deliveryType = 'upload';
      const format = '.jpg';
      const host = 'res.cloudinary.com';
      const publicId = 'turtle';
      const signature = 's--abc12345--';
      const transformations = ['c_limit,w_960'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${signature}/${transformations.join('/')}/v${version}/${publicId}${format}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a fetched image Cloudinary URL with no signature, no format, and nested folder', () => {
      const assetType = 'image';
      const cloudName = 'test-cloud';
      const deliveryType = 'fetch';
      const format = undefined;
      const host = 'res.cloudinary.com';
      const publicId = 'images/turtle';
      const signature = undefined;
      const transformations = ['c_limit,w_960'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${transformations.join('/')}/v${version}/${publicId}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a Cloudinary URL with a signature that has special characters', () => {
      const assetType = 'image';
      const cloudName = 'test-cloud';
      const deliveryType = 'fetch';
      const format = undefined;
      const host = 'res.cloudinary.com';
      const publicId = 'images/turtle';
      const signature = 's--abc-_123--';
      const transformations = ['c_limit,w_960'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${signature}/${transformations.join('/')}/v${version}/${publicId}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a Cloudinary URL with a signature that has 32 characters', () => {
      const assetType = 'image';
      const cloudName = 'test-cloud';
      const deliveryType = 'fetch';
      const format = undefined;
      const host = 'res.cloudinary.com';
      const publicId = 'images/turtle';
      const signature = 's--abcdefghij0123456789abcde01234_---';
      const transformations = ['c_limit,w_960'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${signature}/${transformations.join('/')}/v${version}/${publicId}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a video Cloudinary URL with deeply nested folders', () => {
      const assetType = 'video';
      const cloudName = 'test-cloud';
      const deliveryType = 'upload';
      const format = '.mp4';
      const host = 'res.cloudinary.com';
      const publicId = 'assets/images/animals/turtle';
      const signature = undefined;
      const transformations = ['c_limit,w_960'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${transformations.join('/')}/v${version}/${publicId}${format}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a video Cloudinary URL with multiple transformation strings', () => {
      const assetType = 'video';
      const cloudName = 'test-cloud';
      const deliveryType = 'upload';
      const format = '.mp4';
      const host = 'res.cloudinary.com';
      const publicId = 'assets/images/animals/turtle';
      const signature = undefined;
      const transformations = ['f_auto,q_auto', 'c_limit,w_960'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${transformations.join('/')}/v${version}/${publicId}${format}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a Cloudinary URL with query parameters', () => {
      const assetType = 'video';
      const cloudName = 'test-cloud';
      const deliveryType = 'upload';
      const format = '.mp4';
      const host = 'res.cloudinary.com';
      const publicId = 'assets/images/animals/turtle';
      const signature = undefined;
      const transformations = ['f_auto,q_auto'];
      const version = 1234;
      const queryParams = {
        _i: 'AA',
        _a: 'AVAADAN0'
      }

      const queryString = Object.keys(queryParams).map(key => `${key}=${queryParams[key]}`).join('&');
      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${transformations.join('/')}/v${version}/${publicId}${format}?${queryString}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        signature,
        transformations,
        version,
        queryParams
      });
    });

    it('should parse a Cloudinary URL with SEO suffix', () => {
      const assetType = 'videos';
      const cloudName = 'test-cloud';
      const deliveryType = undefined;
      const format = '.mp4';
      const host = 'res.cloudinary.com';
      const publicId = 'assets/images/animals/turtle';
      const seoSuffix = 'cool-turtles';
      const signature = undefined;
      const transformations = ['f_auto,q_auto'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${transformations.join('/')}/v${version}/${publicId}/${seoSuffix}${format}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        seoSuffix,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a Cloudinary URL with a . in the public ID', () => {
      const assetType = 'images';
      const cloudName = 'test-cloud';
      const deliveryType = undefined;
      const format = '.png';
      const host = 'res.cloudinary.com';
      const publicId = 'sticker-keepdevweird-2.5in-holographic';
      const seoSuffix = 'sticker-keepdevweird-2.5in-holographic';
      const signature = undefined;
      const transformations = ['f_auto,q_auto'];
      const version = 1234;

      const src = `https://${host}/${cloudName}/${assetType}/${transformations.join('/')}/v${version}/${publicId}/${seoSuffix}${format}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        publicId,
        seoSuffix,
        signature,
        transformations,
        version,
      });
    });

    it('should parse a non-HTTPS Cloudinary URL', () => {
      const assetType = 'image';
      const cloudName = 'test-cloud';
      const deliveryType = 'upload';
      const host = 'res.cloudinary.com';
      const publicId = 'turtle';
      const version = 1234;

      const src = `http://${host}/${cloudName}/${assetType}/${deliveryType}/v${version}/${publicId}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        host,
        publicId,
        version,
      })
    });

    it('should parse a Cloudinary URL with a secure distribution with private CDN', () => {
      const assetType = 'image';
      const deliveryType = 'upload';
      const host = 'assets.mycoolsite.com';
      const publicId = 'asdf';
      const version = 1234;

      const src = `http://${host}/${assetType}/${deliveryType}/v${version}/${publicId}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        deliveryType,
        host,
        publicId,
        version,
      })
    });

    it('should parse a Cloudinary URL with a secure distribution including a cloud name', () => {
      const assetType = 'image';
      const cloudName = 'test-cloud';
      const deliveryType = 'upload';
      const host = 'assets.mycoolsite.com';
      const publicId = 'asdf';
      const version = 1234;

      const src = `http://${host}/${cloudName}/${assetType}/${deliveryType}/v${version}/${publicId}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        host,
        publicId,
        version,
      })
    });

    it('should throw an error if delivering from res.cloudinary.com without a cloud name', () => {
      const assetType = 'image';
      const deliveryType = 'upload';
      const host = 'res.cloudinary.com';
      const publicId = 'asdf';
      const version = 1234;

      const src = `http://${host}/${assetType}/${deliveryType}/v${version}/${publicId}`;

      expect(() => parseUrl(src)).toThrowError('Cloudinary URL delivered from res.cloudinary.com must include Cloud Name (ex: res.cloudinary.com/<Cloud Name>/image/...)');
    });
  });

  describe('parseUrl memoization', () => {
    // parseUrl memoizes by `src`. `decodeURIComponent` is a global called once per
    // successful parse (on the public ID), so spying on it is a clean way to observe
    // whether a given call actually ran the parse pipeline or was served from cache.

    it('parses a given src only once and serves repeated calls from cache', () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/v1234/memoize-once`;
      const decodeSpy = vi.spyOn(globalThis, 'decodeURIComponent');

      const first = parseUrl(src); // cache miss -> runs the parse
      const callsAfterMiss = decodeSpy.mock.calls.length;
      expect(callsAfterMiss).toBeGreaterThan(0);

      const second = parseUrl(src); // cache hit -> must not re-run the parse
      expect(decodeSpy).toHaveBeenCalledTimes(callsAfterMiss);

      // The cached result still matches a fresh parse of the same URL.
      expect(second).toEqual(first);
    });

    it('returns deeply-independent copies so callers cannot mutate cached state', () => {
      const src = `https://res.cloudinary.com/test-cloud/video/upload/f_auto,q_auto/c_limit,w_960/v1234/nested/folder/turtle.mp4?_i=AA&_a=BB`;

      const first = parseUrl(src);
      const second = parseUrl(src);

      expect(second).toEqual(first);
      // Nested values must be fresh per call, not shared with the cache entry.
      expect(second.transformations).not.toBe(first.transformations);
      expect(second.queryParams).not.toBe(first.queryParams);

      // Mutating a returned copy must not leak into the cache / later calls.
      first.transformations.push('x_injected');
      first.queryParams.injected = true;

      const third = parseUrl(src);
      expect(third.transformations).not.toContain('x_injected');
      expect(third.queryParams).not.toHaveProperty('injected');
    });

    it('does not cache failures - invalid src throws on every call', () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/memoize-no-version`;
      expect(() => parseUrl(src)).toThrow('Invalid src: Does not include version');
      // A second call must throw the same error (the failure was not memoized).
      expect(() => parseUrl(src)).toThrow('Invalid src: Does not include version');
    });
  });

  describe('getPublicId', () => {
    it('should throw an error on a Cloudinary URL without a version', () => {
      const publicId = 'turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/${publicId}`;
      expect(() => getPublicId(src)).toThrow('Invalid src: Does not include version')
    });

    it('should return the public ID of a Cloudinary URL', () => {
      const publicId = 'turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/${publicId}`;
      expect(getPublicId(src)).toBe(publicId);
    });

    it('should return the public ID of a Cloudinary URL using SEO Suffixes', () => {
      const publicId = 'ecommerce-with-nextjs-and-stripe';
      const seoSuffix = 'my-seo-suffix'
      const src = `https://res.cloudinary.com/test-cloud/images/f_auto,q_auto/v1654624121/${publicId}/${seoSuffix}.jpg?_i=AA`;
      expect(getPublicId(src)).toBe(publicId);
    });
  });

  describe('getTransformations', () => {
    it('should return an empty array with no transformations', () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/v1/app/images/turtle`;
      expect(getTransformations(src)).toEqual([]);
    });

    it('should return the transformations of a Cloudinary URL with a single transformation in a single set', () => {
      const transformations = [
        ['w_960']
      ];
      const src = `https://res.cloudinary.com/test-cloud/image/upload/${transformations.map(t => t.join(',')).join('/')}/v1/app/images/turtle`;
      expect(getTransformations(src)).toEqual(transformations);
    });

    it('should return the transformations of a Cloudinary URL with multiple transformations in a single set', () => {
      const transformations = [
        ['c_limit', 'w_960']
      ];
      const src = `https://res.cloudinary.com/test-cloud/image/upload/${transformations.map(t => t.join(',')).join('/')}/v1/app/images/turtle`;
      expect(getTransformations(src)).toEqual(transformations);
    });

    it('should return the transformations of a Cloudinary URL with multiple transformations and multiple sets', () => {
      const transformations = [
        ['c_limit', 'w_960'],
        ['f_auto'],
        ['q_auto'],
      ];
      const src = `https://res.cloudinary.com/test-cloud/image/upload/${transformations.map(t => t.join(',')).join('/')}/v1/app/images/turtle`;
      expect(getTransformations(src)).toEqual(transformations);
    });
  });

  describe('getFormat', () => {
    it('should return format from Cloudinary URL', () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/v1/app/images/turtle.jpg`;
      expect(getFormat(src)).toEqual('.jpg');
    });
    it('should return format from public ID', () => {
      const src = `images/turtle.mp4`;
      expect(getFormat(src)).toEqual('.mp4');
    });
    it('should not return format not supported format', () => {
      const src = `images/turtle.colby`;
      expect(getFormat(src)).toEqual(undefined);
    });
    it('should return undefined if no format', () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/v1/app/images/turtle`;
      expect(getFormat(src)).toEqual(undefined);
    });
  });
})
