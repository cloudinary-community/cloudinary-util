import { parseUrl, getPublicId, getTransformations } from '../../src/lib/cloudinary';

// Mock console.warn() so we can see when it's called
global.console = {
  ...global.console,
  warn: jest.fn()
}

describe('Cloudinary', () => {
  afterEach(() => {
    // Clears the state of console.warn, in case multiple tests want to monitor it
    jest.restoreAllMocks()
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
})
