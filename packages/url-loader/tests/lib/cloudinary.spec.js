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

    /* Optimization */

    describe('format, quality', () => {

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

    });

    /* Delivery */

    describe('deliveryType', () => {

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

      it('should create a Cloudinary URL from a Cloudinary source', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'fetch';
        const publicId = 'myimage';

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}?_a=A`;

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

        expect(url).toContain(src);
      });

    })

    /* SEO */

    describe('seoSuffix', () => {

      it('should create a Cloudinary URL with an SEO suffix', () => {
        const cloudName = 'customtestcloud';
        const publicId = 'myimage';
        const seoSuffix = 'test-image';

        const src = `https://res.cloudinary.com/${cloudName}/images/c_limit,w_100/f_auto/q_auto/v1234/${publicId}/${seoSuffix}?_a=A`;

        const url = constructCloudinaryUrl({
          options: {
            src,
            width: 100,
            height: 100,
            seoSuffix
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(src);
      });

      it('should create a Cloudinary URL from a Cloudinary source with SEO prefixes', () => {
        const cloudName = 'customtestcloud';
        const assetType = 'images';
        const publicId = 'myimage/my-image';
        const width = 1234;
        const height = 1234;

        const src = `https://res.cloudinary.com/${cloudName}/${assetType}/c_limit,w_${width}/f_auto/q_auto/v1234/${publicId}?_a=A`;

        const url = constructCloudinaryUrl({
          options: {
            src,
            width,
            height,
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(src);
      });

      it('should create a NON-SEO prefixed Cloudinary URL from a Cloudinary source with SEO prefixes when delivery type is fetch', () => {
        const cloudName = 'customtestcloud';
        const assetType = 'images';
        const publicId = 'colby-hug';
        const seoSuffix = 'colby-hug';
        const format = '.jpg';
        const width = 1234;
        const height = 1234;

        const src = `https://res.cloudinary.com/${cloudName}/${assetType}/c_limit,w_${width}/f_auto/q_auto/v1234/${publicId}/${seoSuffix}${format}?_i=A`;
        const exepectedSrc = `https://res.cloudinary.com/${cloudName}/image/fetch/c_limit,w_${width}/f_auto/q_auto/v1234/${publicId}?_a=A`

        const url = constructCloudinaryUrl({
          options: {
            src,
            width,
            height,
            deliveryType: 'fetch'
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(exepectedSrc);
      });

      it('should create a Cloudinary URL from a Cloudinary source with SEO prefixes and overriding', () => {
        const cloudName = 'customtestcloud';
        const assetType = 'images';
        const publicId = 'myimage';
        const originalSeoSuffix = 'my-image'
        const seoSuffix = 'test-image';

        const src = `https://res.cloudinary.com/${cloudName}/${assetType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}/${originalSeoSuffix}?_a=A`;

        const url = constructCloudinaryUrl({
          options: {
            src,
            width: 100,
            height: 100,
            seoSuffix
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(src.replace(originalSeoSuffix, seoSuffix));
      });

    });

    /* Versioning */

    describe('version', () => {
      it('should add a custom version to a URL', () => {
        const cloudName = 'customtestcloud';
        const version = 1029384756;

        const url = constructCloudinaryUrl({
          options: {
            src: 'turtle',
            version
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        // Only match the analytics version (A) and the ID as the rest is determined
        // dynamically by SDK and Next.js version
        expect(url).toContain(`/v${version}/`);
      });
    });

    /* Analytics */

    describe('analytics', () => {

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

    });

    /* Raw Transformations */

    describe('rawTransformations', () => {

      it('should apply rawTransformations to the beginning of the URL', () => {
        const cloudName = 'customtestcloud';
        const src = 'turtle';
        const rawTransformations = ['c_crop,h_359,w_517,x_1483,y_0/c_scale,h_359,w_517/f_auto,q_auto'];
        const url = constructCloudinaryUrl({
          options: {
            src,
            rawTransformations
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`image/upload/${rawTransformations.join('/')}/f_auto/q_auto/${src}`);
      });

    })


  });
});
