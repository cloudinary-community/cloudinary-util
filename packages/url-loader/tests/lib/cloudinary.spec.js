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

    it('should create a Cloudinary image URL', () => {
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

    it('should create a Cloudinary video URL', () => {
      const cloudName = 'customtestcloud';
      const assetType = 'video';
      const url = constructCloudinaryUrl({
        options: {
          assetType,
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
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/${assetType}/upload/c_limit,w_100/f_auto/q_auto/turtle`);
    });

    /* Optimization */

    describe('format, quality, dpr', () => {

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

      it('should not include quality or format in URL', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'myimage';

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/v1234/${publicId}?_a=B`;

        const url = constructCloudinaryUrl({
          options: {
            src,
            width: 100,
            height: 100,
            quality: 'default',
            format: 'default'
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(src);
      });

      it('should include custom DPR as a string', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'myimage';
        const dpr = '2.0';

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/dpr_${dpr}/f_auto/q_auto/${publicId}?_a=B`;

        const url = constructCloudinaryUrl({
          options: {
            src: publicId,
            width: 100,
            height: 100,
            dpr
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(src);
      });

      it('should include custom DPR as number', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'myimage';
        const dpr = 2;

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/dpr_${dpr.toFixed(1)}/f_auto/q_auto/${publicId}?_a=B`;

        const url = constructCloudinaryUrl({
          options: {
            src: publicId,
            width: 100,
            height: 100,
            dpr
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(src);
      });
      it('should include DPR auto', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'myimage';
        const dpr = 'auto';

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/dpr_${dpr}/f_auto/q_auto/${publicId}?_a=B`;

        const url = constructCloudinaryUrl({
          options: {
            src: publicId,
            width: 100,
            height: 100,
            dpr
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(src);
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

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}?_a=B`;

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

      it('should create a Cloudinary URL from a non-HTTPS Cloudinary source', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'fetch';
        const publicId = 'myimage';

        const src = `res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}?_a=B`;

        const url = constructCloudinaryUrl({
          options: {
            src: `http://${src}`,
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

        expect(url).toContain(`https://${src}`);
      });

      it('should create a Cloudinary URL from a Cloudinary source with existing URL encoding', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'my%20pug%20v2';

        const src = `res.cloudinary.com/${cloudName}/image/${deliveryType}/f_auto/q_auto/v1234/${publicId}?_a=B`;

        const url = constructCloudinaryUrl({
          options: {
            src: `http://${src}`,
            deliveryType
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(`https://${src}`);
      });
    })

    /* SEO */

    describe('seoSuffix', () => {

      it('should create a Cloudinary URL with an SEO suffix', () => {
        const cloudName = 'customtestcloud';
        const publicId = 'myimage';
        const seoSuffix = 'test-image';

        const src = `https://res.cloudinary.com/${cloudName}/images/c_limit,w_100/f_auto/q_auto/v1234/${publicId}/${seoSuffix}?_a=B`;

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

        const src = `https://res.cloudinary.com/${cloudName}/${assetType}/c_limit,w_${width}/f_auto/q_auto/v1234/${publicId}?_a=B`;

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
        const exepectedSrc = `https://res.cloudinary.com/${cloudName}/image/fetch/c_limit,w_${width}/f_auto/q_auto/v1234/${publicId}?_a=B`

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

        const src = `https://res.cloudinary.com/${cloudName}/${assetType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}/${originalSeoSuffix}?_a=B`;

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
        const expectedId = 'BBAAABDJ0';
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
            sdkCode: 'A',
            sdkSemver: '1.0.0',
            techVersion: '1.2.3',
            product: 'B'
          }
        });
        expect(url).toContain(`?_a=${expectedId}`);
      });

    });

    /* Custom Config */

    describe('analytics', () => {

      it('should include an analytics ID at the end of the URL', () => {
        const cloudName = 'customtestcloud';
        const secureDistribution = 'spacejelly.dev';
        const url = constructCloudinaryUrl({
          options: {
            src: 'turtle',
          },
          config: {
            cloud: {
              cloudName
            },
            url: {
              secureDistribution
            }
          }
        });
        expect(url).toContain(`https://${secureDistribution}/${cloudName}`);
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

    /* Strict Transformations */

    describe('strictTransformations', () => {

      it('should not add any transformations when strict transformations is enabled', () => {
        const cloudName = 'customtestcloud';
        const src = 'turtle';
        const url = constructCloudinaryUrl({
          options: {
            src,
            strictTransformations: true
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`image/upload/${src}`);
      });

      it('should add named transformations when strict transformations is enabled', () => {
        const cloudName = 'customtestcloud';
        const src = 'turtle';
        const namedTransformation = 'my-transformation';
        const url = constructCloudinaryUrl({
          options: {
            src,
            strictTransformations: true,
            transformations: [namedTransformation]
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`image/upload/t_${namedTransformation}/${src}`);
      });

      it('should not add any transformations when strict transformations is enabled', () => {
        const cloudName = 'customtestcloud';
        const src = 'turtle';
        const url = constructCloudinaryUrl({
          options: {
            src,
            strictTransformations: true,
            removeBackground: true,
            width: 100,
            height: 200,
            effects: [{
              opacity: .5
            }]
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`image/upload/${src}`);
      });

    })

    /* General Plugins */

    describe('Plugins', () => {

      it('should not apply an image-only plugin to a video asset', () => {
        const cloudName = 'customtestcloud';
        const assetType = 'video';
        const src = 'turtle';
        const zoompan = 'loop';
        const url = constructCloudinaryUrl({
          options: {
            src,
            assetType,
            zoompan
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`${assetType}/upload/f_auto/q_auto/${src}`);
      });

    })

    /* Effects */

    it('should apply effects by array', () => {
      const cloudName = 'customtestcloud';
        const assetType = 'video';
        const src = 'turtle';
        const shear = '40:0';
        const gradientFade = true;
        const opacity = '50';
        const cartoonify = '50';
        const radius = '150';
        const url = constructCloudinaryUrl({
          options: {
            src,
            assetType,
            effects: [
              {
                shear,
                opacity,
              },
              {
                gradientFade,
                cartoonify,
                radius
              }
            ]
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`${assetType}/upload/o_${opacity},e_shear:${shear}/e_cartoonify:${cartoonify},e_gradient_fade,r_${radius}/f_auto/q_auto/${src}`);
    });


  });
});
