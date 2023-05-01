import { Cloudinary } from '@cloudinary/url-gen';

import * as effectsPlugin from '../../src/plugins/effects';

const { plugin, DEFAULT_TEXT_OPTIONS } = effectsPlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Plugins', () => {
  it('should apply effects ', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);

    const shear = '40:0';
    const opacity = '50';

    const options = {
      shear,
      opacity,
    }

    plugin({
      cldAsset: cldImage,
      options
    });

    expect(cldImage.toURL()).toContain(`/o_${opacity}/e_shear:${shear}/`);
  });
  it('should apply effects by array', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);

    const shear = '40:0';
    const gradientFade = true;
    const opacity = '50';
    const cartoonify = '50';
    const radius = '150';

    const options = {
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
    }

    plugin({
      cldAsset: cldImage,
      options
    });

    expect(cldImage.toURL()).toContain(`/o_${opacity},e_shear:${shear}/e_cartoonify:${cartoonify},e_gradient_fade,r_${radius}/`);
  });

  it('should colorize with a hex color value', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);

    const color = '#ff00ff';
    const colorExpected = 'rgb:ff00ff';
    const colorize = 50;


    const options = {
      effects: [
        {
          color,
          colorize
        },
      ]
    }

    plugin({
      cldAsset: cldImage,
      options
    });

    expect(cldImage.toURL()).toContain(`/co_${colorExpected},e_colorize:${colorize}/`);
  });
});