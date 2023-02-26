import { constructCloudinaryUrl } from '../../../src/lib/cloudinary';

// Mock console.warn() so we can see when it's called
global.console = {
  ...global.console,
  warn: jest.fn()
};

describe('Cloudinary Sinitize', () => {
  afterEach(() => {
    // Clears the state of console.warn, in case multiple tests want to monitor it
    jest.restoreAllMocks();
  });

  describe('constructCloudinaryUrl', () => {
    it('should include fl_sanitize when display image source name end with svg', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle.svg'
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

    it('should include fl_sanitize and f_svg when display format is svg', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle',
          format: 'svg'
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });

      expect(url).toContain(
        `https://res.cloudinary.com/${cloudName}/image/upload/fl_sanitize/f_svg/q_auto/turtle.svg`
      );
    });

    it('should include fl_sanitize and f_svg when display format svg image', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle.svg',
          format: 'svg'
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });

      expect(url).toContain(
        `https://res.cloudinary.com/${cloudName}/image/upload/fl_sanitize/f_svg/q_auto/turtle.svg`
      );
    });

    it('should not include fl_sanitize when set option sanitize to false', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle.svg',
          sanitize: false
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });

      expect(url).toContain(
        `https://res.cloudinary.com/${cloudName}/image/upload/f_auto/q_auto/turtle.svg`
      );
    });

    it('should not include fl_sanitize when display other image', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'other_image_type'
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });

      expect(url).toContain(
        `https://res.cloudinary.com/${cloudName}/image/upload/f_auto/q_auto/notSvgImage`
      );
    });
  });
});
