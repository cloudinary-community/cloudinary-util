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
      const id = 'turtle';
      const signature = 's--abc12345--';
      const transformations = ['c_limit,w_960'];
      const version = 'v1234';

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${signature}/${transformations.join('/')}/${version}/${id}${format}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        id,
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
      const id = 'images/turtle';
      const signature = undefined;
      const transformations = ['c_limit,w_960'];
      const version = 'v1234';

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${transformations.join('/')}/${version}/${id}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        id,
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
      const id = 'assets/images/animals/turtle';
      const signature = undefined;
      const transformations = ['c_limit,w_960'];
      const version = 'v1234';

      const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${transformations.join('/')}/${version}/${id}${format}`;

      expect(parseUrl(src)).toMatchObject({
        assetType,
        cloudName,
        deliveryType,
        format,
        host,
        id,
        signature,
        transformations,
        version,
      });
    });

    // TODO: currently only grabs the last transformation string
    // it('should parse a video Cloudinary URL with multiple transformation strings', () => {
    //   const assetType = 'video';
    //   const cloudName = 'test-cloud';
    //   const deliveryType = 'upload';
    //   const format = '.mp4';
    //   const host = 'res.cloudinary.com';
    //   const id = 'assets/images/animals/turtle';
    //   const signature = undefined;
    //   const transformations = ['f_auto,q_auto', 'c_limit,w_960'];
    //   const version = 'v1234';

    //   const src = `https://${host}/${cloudName}/${assetType}/${deliveryType}/${transformations.join('/')}/${version}/${id}${format}`;

    //   expect(parseUrl(src)).toMatchObject({
    //     assetType,
    //     cloudName,
    //     deliveryType,
    //     format,
    //     host,
    //     id,
    //     signature,
    //     transformations,
    //     version,
    //   });
    // });
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
  });

  describe("getTransformations", () => {
    it("should return a non-Cloudinary url", () => {
      const src = "https://google.com";
      expect(getTransformations(src, true)).toEqual([]);
    });

    it("should return the transformations of a Cloudinary URL with a single transformation", () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/w_960/v1/app/images/turtle`;
      expect(getTransformations(src, true)).toEqual(["w_960"]);
    });

    it("should return the transformations of a Cloudinary URL with multiple transformations", () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/v1/app/images/turtle`;
      expect(getTransformations(src, true)).toEqual(["c_limit", "w_960"]);
    });

    it("should return the transformations of a Cloudinary URL with multiple transformations with / delimiter", () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/app/images/turtle`;
      expect(getTransformations(src, true)).toEqual(["c_limit","w_960","f_auto","q_auto"]);
    });

    it("should return invalid url with a warning", () => {
      const src = 245;
      expect(() => {getTransformations(src, true)}).toThrow(Error);
      expect(() => {getTransformations(src, true)}).toThrow(`Invalid src of type number`);
    });
  });
})