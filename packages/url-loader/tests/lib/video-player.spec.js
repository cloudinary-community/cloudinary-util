import { describe, expect, it } from 'vitest';

import { getVideoPlayerOptions } from '../../src/lib/video-player';

describe('video-player', () => {
  describe('getVideoPlayerOptions', () => {
    describe('Basic', () => {
      it('should return create an options object with minimal config', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        const expectedOptions = {
          aspectRatio: '1620:1080',
          autoplay: false,
          autoplayMode: undefined,
          cloud_name: 'testcloud',
          controls: true,
          height: '1080',
          language: undefined,
          languages: undefined,
          loop: false,
          muted: false,
          privateCdn: undefined,
          publicId: 'videos/mountain-stars',
          secureDistribution: undefined,
          showLogo: true,
          transformation: [
            { quality: 'auto' },
            undefined
          ],
          width: '1620',
        }

        expect(getVideoPlayerOptions(options, config)).toMatchObject(expectedOptions)
      });

      it('should return create an options object without a width or height', () => {
        const options = {
          src: 'videos/mountain-stars',
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        const expectedOptions = {
          autoplay: false,
          autoplayMode: undefined,
          cloud_name: 'testcloud',
          controls: true,
          language: undefined,
          languages: undefined,
          loop: false,
          muted: false,
          privateCdn: undefined,
          publicId: 'videos/mountain-stars',
          secureDistribution: undefined,
          showLogo: true,
          transformation: [
            { quality: 'auto' },
            undefined
          ],
        }

        const playerOptions = getVideoPlayerOptions(options, config);

        expect(playerOptions).toMatchObject(expectedOptions);
        expect(playerOptions.width).toBeUndefined();
        expect(playerOptions.height).toBeUndefined();
        expect(playerOptions.aspectRatio).toBeUndefined();
      });

      it('should return create an options object with only an aspect ratio', () => {
        const options = {
          src: 'videos/mountain-stars',
          aspectRatio: '16:9'
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        const expectedOptions = {
          aspectRatio: options.aspectRatio,
          autoplay: false,
          autoplayMode: undefined,
          cloud_name: 'testcloud',
          controls: true,
          language: undefined,
          languages: undefined,
          loop: false,
          muted: false,
          privateCdn: undefined,
          publicId: 'videos/mountain-stars',
          secureDistribution: undefined,
          showLogo: true,
          transformation: [
            { quality: 'auto' },
            undefined
          ],
        }

        const playerOptions = getVideoPlayerOptions(options, config);

        expect(playerOptions).toMatchObject(expectedOptions);
        expect(playerOptions.width).toBeUndefined();
        expect(playerOptions.height).toBeUndefined();
      });

      it('should configure custom quality', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          quality: 50,
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        expect(getVideoPlayerOptions(options, config)).toMatchObject({
          transformation: [
            { quality: options.quality },
            undefined
          ],
        })
      });
    })

    describe('Playback', () => {
      it('should configure ABR via source types', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          transformation: {
            streaming_profile: 'hd',
          },
          sourceTypes: ['hls'],
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        expect(getVideoPlayerOptions(options, config)).toMatchObject({
          transformation: [
            { quality: 'auto' },
            { streaming_profile: 'hd' }
          ],
          sourceTypes: ['hls'],
        });
      });
    })

    describe('Customization', () => {
      it('should configure custom logo and colors', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          fontFace: 'Colby',
          logo: {
            imageUrl: 'https://image.com',
            onClickUrl: 'https://spacejelly.dev'
          },
          colors: {
            accent: '#ff0000',
            base: '#00ff00',
            text: '#0000ff'
          }
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        expect(getVideoPlayerOptions(options, config)).toMatchObject({
          fontFace: options.fontFace,
          logoImageUrl: options.logo.imageUrl,
          logoOnclickUrl: options.logo.onClickUrl,
          showLogo: true,
          colors: options.colors
        });
      });

      it('should set a custom poster using a string', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          poster: 'string'
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        const playerOptions = getVideoPlayerOptions(options, config);

        expect(playerOptions.posterOptions.publicId).toContain(options.poster)
      });

      it('should set a custom poster using constructCloudinaryUrl options syntax with public ID inherited', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          poster: {
            tint: 'equalize:80:blue:blueviolet'
          }
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        const playerOptions = getVideoPlayerOptions(options, config);

        expect(playerOptions.posterOptions.publicId).toContain(`https://res.cloudinary.com/${config.cloud.cloudName}/video/upload/e_tint:${options.poster.tint}/f_auto:image/q_auto/v1/${options.src}`);
      });

      it('should set a custom poster using constructCloudinaryUrl options syntax with custom thumb public ID', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          poster: {
            src: 'my-custom-public-id',
            tint: 'equalize:80:blue:blueviolet'
          }
        }

        const config = {
          cloud: {
            cloudName: 'testcloud'
          }
        };

        const playerOptions = getVideoPlayerOptions(options, config);

        expect(playerOptions.posterOptions.publicId).toContain(`https://res.cloudinary.com/${config.cloud.cloudName}/image/upload/e_tint:${options.poster.tint}/f_auto/q_auto/v1/${options.poster.src}`);
      });
    })
  });
});