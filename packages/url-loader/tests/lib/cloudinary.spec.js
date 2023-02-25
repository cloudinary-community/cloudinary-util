import { constructCloudinaryUrl } from '../../src/lib/cloudinary';

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

  describe('constructCloudinaryUrl', () => {
    it('should create a Cloudinary URL', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle',
          width: 100,
          height: 100
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_100/f_auto/q_auto/turtle`);
    });

    it('should create a Cloudinary URL with a remote source', () => {
      const cloudName = 'customtestcloud';
      const deliveryType = 'fetch';
      const src = 'https://upload.wikimedia.org/wikipedia/commons/4/44/Jelly_cc11.jpg';
      const url = constructCloudinaryUrl({
        options: {
          src,
          width: 100,
          height: 100,
          deliveryType
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/f_auto/q_auto/${src}`);
    });

    it('should create a Cloudinary URL with custom quality and format options', () => {
      const format = 'png';
      const quality = 75;
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle',
          width: 100,
          height: 100,
          format,
          quality
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_100/f_${format}/q_${quality}/turtle`);
    });

    it('should include an analytics ID at the end of the URL', () => {
      const cloudName = 'customtestcloud';
      const sdkCode = 'V';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle',
        },
        config: {
          cloud: {
            cloudName
          }
        },
        analytics: {
          sdkCode
        }
      });
      // Only match the analytics version (A) and the ID as the rest is determined
      // dynamically by SDK and Next.js version
      expect(url).toContain(`?_a=A${sdkCode}`);
    });

    it('should include fl_sanitize when display svg image', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle.svg',
          sanitize: true
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });

      expect(url).toContain(
        `https://res.cloudinary.com/${cloudName}/image/upload/fl_sanitize/f_auto/q_auto/turtle.svg`
      );
    });
  });
});
