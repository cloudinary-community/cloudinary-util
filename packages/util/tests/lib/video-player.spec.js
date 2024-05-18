import { describe, it, expect } from 'vitest';

import { getVideoPlayerOptions } from '../../src/lib/video-player';

describe('video-player', () => {
  describe('getVideoPlayerOptions', () => {
    describe('Basic', () => {
      it('should return create an options object with minimal config', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          // the config is framework agnostic so explicitly define this
          config: {
            cloud: {
              cloudName: 'testcloud'
            }
          },
        }
  
        const expectedOptions = {
          aspectRatio: '1620:1080',
          autoplay: false,
          autoplayMode: undefined,
          cloud_name: 'testcloud',
          controls: true,
          fontFace: '',
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
  
        expect(getVideoPlayerOptions(options)).toMatchObject(expectedOptions)
      });

      it('should configure custom quality', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          quality: 50,
          // the config is framework agnostic so explicitly define this
          config: {
            cloud: {
              cloudName: 'testcloud'
            }
          },
        }
  
        expect(getVideoPlayerOptions(options)).toMatchObject({
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
          // the config is framework agnostic so explicitly define this
          config: {
            cloud: {
              cloudName: 'testcloud'
            }
          },
        }
    
        expect(getVideoPlayerOptions(options)).toMatchObject({
          transformation: [
            { quality: 'auto' },
            { streaming_profile: 'hd' }
          ],
          sourceTypes: ['hls'],
        });
      });
    })

    describe('Customization', () => {
      it('should configure custom logo', () => {
        const options = {
          width: '1620',
          height: '1080',
          src: 'videos/mountain-stars',
          logo: {
            imageUrl: 'https://image.com',
            onClickUrl: 'https://spacejelly.dev'
          },
          // the config is framework agnostic so explicitly define this
          config: {
            cloud: {
              cloudName: 'testcloud'
            }
          },
        }
    
        expect(getVideoPlayerOptions(options)).toMatchObject({
          logoImageUrl: options.logo.imageUrl,
          logoOnclickUrl: options.logo.onClickUrl,
          showLogo: true
        });
      });
    })
    

  });
});