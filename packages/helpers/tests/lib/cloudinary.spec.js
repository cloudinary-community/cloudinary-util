import { getPublicId, getTransformations } from '../../src/lib/cloudinary';

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

  describe('getPublicId', () => {
    it('Just returns a non-Cloudinary url', () => {
      const src = 'https://google.com';
      expect(getPublicId(src)).toBe(src)
    });

    it('Just returns the public ID of a Cloudinary URL 1 folder deep', () => {
      const publicId = 'turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/${publicId}`;
      expect(getPublicId(src)).toBe(publicId);
    });

    it('Just returns the public ID of a Cloudinary URL 1 folder deep', () => {
      const publicId = 'images/turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/${publicId}`;
      expect(getPublicId(src)).toBe(publicId);
    });

    it('Just returns the public ID of a Cloudinary URL 2 folders deep', () => {
      const publicId = 'app/images/turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/${publicId}`;
      expect(getPublicId(src)).toBe(publicId);
    });

    it('Returns invalid Cloudinary url with a warning', () => {
      const src = 'https://res.cloudinary.com';
      expect(getPublicId(src)).toBe(src)
      expect(console.warn)
        .toBeCalledWith(`Not possible to retrieve the publicUrl from ${src}, make sure it's a valid cloudinary image url.`)
    });
  });

  describe("getTransformations", () => {
    it("gets a non-Cloudinary url", () => {
      const src = "https://google.com";
      expect(getTransformations(src, true)).toEqual([]);
    });

    it("returns the transformations of a Cloudinary URL with a single transformation", () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/w_960/v1/app/images/turtle`;
      expect(getTransformations(src, true)).toEqual(["w_960"]);
    });

    it("returns the transformations of a Cloudinary URL with multiple transformations", () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/v1/app/images/turtle`;
      expect(getTransformations(src, true)).toEqual(["c_limit", "w_960"]);
    });

    it("returns the transformations of a Cloudinary URL with multiple transformations with / delimiter", () => {
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/app/images/turtle`;
      expect(getTransformations(src, true)).toEqual(["c_limit","w_960","f_auto","q_auto"]);
    });

    it("Returns invalid url with a warning", () => {
      const src = 245;
      expect(() => {getTransformations(src, true)}).toThrow(Error);
      expect(() => {getTransformations(src, true)}).toThrow(`Invalid src of type number`);
    });
  });
})
