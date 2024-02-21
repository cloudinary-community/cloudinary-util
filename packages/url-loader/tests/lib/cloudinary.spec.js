import { vi, describe, it, expect, afterEach } from 'vitest';

import { constructCloudinaryUrl } from '../../src/lib/cloudinary';

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

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/v1234/${publicId}?_a=`;

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

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/dpr_${dpr}/f_auto/q_auto/${publicId}?_a=`;

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

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/dpr_${dpr.toFixed(1)}/f_auto/q_auto/${publicId}?_a=`;

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

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/dpr_${dpr}/f_auto/q_auto/${publicId}?_a=`;

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

    /* Cropping & Resizing */

    describe('cropping, resizing', () => {

      it('should create a Cloudinary URL with a width, height, and custom crop', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'myimage';
        const width = 900;
        const height = 900;
        const crop = 'auto';

        const url = constructCloudinaryUrl({
          options: {
            src: publicId,
            width,
            height,
            crop
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_${crop},w_${width},h_${height},g_auto/f_auto/q_auto/${publicId}`);
      });

      it('should create a Cloudinary URL with a aspect ratio, custom crop, zoom, and default gravity', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'myimage';
        const aspectRatio = '16:9';
        const crop = 'fill';
        const zoom = '1.2';

        const url = constructCloudinaryUrl({
          options: {
            src: publicId,
            aspectRatio,
            crop,
            zoom
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_${crop},ar_${aspectRatio},g_auto,z_${zoom}/f_auto/q_auto/${publicId}`);
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

        const src = `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}?_a=`;

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

        const src = `res.cloudinary.com/${cloudName}/image/${deliveryType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}?_a=`;

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

        const src = `res.cloudinary.com/${cloudName}/image/${deliveryType}/f_auto/q_auto/v1234/${publicId}?_a=`;

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

      it('should create a Cloudinary URL from a Cloudinary source with spaces and commas', () => {
        const cloudName = 'customtestcloud';
        const deliveryType = 'upload';
        const publicId = 'cancun/Lucha libre, Tacos and Beer4';
        const expectedId = 'cancun/Lucha%20libre%2C%20Tacos%20and%20Beer4'

        const url = constructCloudinaryUrl({
          options: {
            src: publicId,
            deliveryType
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/${deliveryType}/f_auto/q_auto/v1/${expectedId}?_a`);
      });
    })

    /* SEO */

    describe('seoSuffix', () => {

      it('should create a Cloudinary URL with an SEO suffix', () => {
        const cloudName = 'customtestcloud';
        const publicId = 'myimage';
        const seoSuffix = 'test-image';

        const src = `https://res.cloudinary.com/${cloudName}/images/c_limit,w_100/f_auto/q_auto/v1234/${publicId}/${seoSuffix}?_a=`;

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

        const src = `https://res.cloudinary.com/${cloudName}/${assetType}/c_limit,w_${width}/f_auto/q_auto/v1234/${publicId}?_a=`;

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
        const exepectedSrc = `https://res.cloudinary.com/${cloudName}/image/fetch/c_limit,w_${width}/f_auto/q_auto/v1234/${publicId}?_a=`

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

        const src = `https://res.cloudinary.com/${cloudName}/${assetType}/c_limit,w_100/f_auto/q_auto/v1234/${publicId}/${originalSeoSuffix}?_a=`;

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

      it('should include an analytics ID at the end of the URL when using a custom config', () => {
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

      it('should not include an analytics ID with config.url.analytics set to false', () => {
        const cloudName = 'customtestcloud';
        const url = constructCloudinaryUrl({
          options: {
            src: 'turtle',
          },
          config: {
            cloud: {
              cloudName
            },
            url: {
              analytics: false
            }
          },
          analytics: {
            sdkCode: 'A',
            sdkSemver: '1.0.0',
            techVersion: '1.2.3',
            product: 'B'
          }
        });
        expect(url).not.toContain(`?_a`);
      });

      it('should not include an analytics ID with analytics set to false', () => {
        const cloudName = 'customtestcloud';
        const url = constructCloudinaryUrl({
          options: {
            src: 'turtle',
          },
          config: {
            cloud: {
              cloudName
            }
          },
          analytics: false
        });
        expect(url).not.toContain(`?_a`);
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
            effects: [{
              opacity: .5
            }],
            version: 2,
            width: 960,
            height: 600,
            widthResize: 1920,
            heightResize: 1200
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });
        expect(url).toContain(`image/upload/${src}?_a=`);
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


    /* Kitchen Sink */

    it('Kitchen Sink - Image', () => {
      const cloudName = 'customtestcloud';
        const assetType = 'image';
        const crop = 'auto';
        const defaultImage = 'my-image.jpg';
        const height = 321;
        const src = 'turtle';
        const width = 123;
        const zoom = '2.0';

        const cartoonify = '50';
        const gradientFade = true;
        const opacity = '50';
        const radius = '150';
        const shear = '40:0';

        const overlaySrc = src;
        const overlayColor = 'blue';
        const overlayShadow = 100;
        const overlayX = 0;
        const overlayY = 0;

        const url = constructCloudinaryUrl({
          options: {
            assetType,
            crop: [
              {
                crop,
                height,
                width,
                zoom,
              },
              {
                crop,
                height,
                width,
                zoom,
                source: true
              },
            ],
            defaultImage,
            height,
            src,
            width,
            zoom,
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
            ],
            overlays: [
              {
                publicId: overlaySrc,
                effects: [
                  {
                    color: overlayColor,
                    shadow: overlayShadow,
                    x: overlayX,
                    y: overlayY
                  }
                ],
                appliedEffects: [
                  {
                    color: overlayColor,
                    shadow: overlayShadow,
                    x: overlayX,
                    y: overlayY
                  }
                ],
              }
            ],
            // Note: removeBackground and restore can't actually be used together
            // in practice, but this is simply testing that it works applies correctly
            recolor: {
              prompt: 'duck',
              to: 'blue',
              multiple: true
            },
            remove: {
              prompt: 'apple',
              multiple: true,
              removeShadow: true
            },
            removeBackground: true,
            restore: true,
            zoompan: true,
          },
          config: {
            cloud: {
              cloudName
            }
          }
        });

        expect(url).toContain([
          assetType,
          `upload`,
          'e_gen_recolor:prompt_duck;to-color_blue;multiple_true',
          `e_gen_remove:prompt_apple;multiple_true;remove-shadow_true`,
          `e_background_removal`,
          `e_gen_restore`,
          `c_${crop},w_${width},h_${height},g_auto,z_${zoom}`,
          `d_${defaultImage}`,
          `o_${opacity},e_shear:${shear}`,
          `e_cartoonify:${cartoonify},e_gradient_fade,r_${radius}`,
          `l_${overlaySrc},co_${overlayColor},e_shadow:${overlayShadow},x_${overlayX},y_${overlayY}`,
          `fl_layer_apply,fl_no_overflow,co_${overlayColor},e_shadow:${overlayShadow},x_${overlayX},y_${overlayY}`,
          `e_zoompan`,
          `c_${crop},w_${width},h_${height},g_auto,z_${zoom}`,
          `f_auto:animated`, // Effect of zoompan
          `q_auto`,
          src
        ].join('/'));
    });


  });
});
