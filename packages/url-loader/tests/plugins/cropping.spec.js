import { Cloudinary } from '@cloudinary/url-gen';
import { describe, expect, it } from 'vitest';

import { croppingPlugin } from '../../src/plugins/cropping';

const { plugin } = croppingPlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Cropping plugin', () => {
  it('should apply a crop and gravity to a URL', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      height: 100,
      crop: 'crop',
      gravity: 'auto'
    };
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_${options.crop},w_${options.width},h_${options.height},g_${options.gravity}`);
  });

  it('should apply a gravity of auto by default if not set explicitly', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      height: 100,
      crop: 'fill'
    };
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_${options.crop},w_${options.width},h_${options.height},g_auto`);
  });

  it('should apply a zoom if set explicitly', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      height: 100,
      crop: 'fill',
      zoom: 0.5
    };
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_${options.crop},w_${options.width},h_${options.height},g_auto,z_${options.zoom}`);
  });

  it('should not include a width if not set', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {};
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toBeUndefined();
  });

  it('should crop as thumb instead of default with object syntax, width, and height', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      crop: {
        width: 100,
        height: 200,
        type: 'thumb'
      }
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_${options.crop.type},w_${options.crop.width},h_${options.crop.height},g_auto`);
  });

  it('should crop as thumb instead of default with object syntax with width inferred', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      height: 600,
      crop: {
        type: 'thumb'
      }
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_${options.crop.type},w_${options.width},h_${options.height},g_auto`);
  });

  it('should crop as thumb in 2 stages with width inferred', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      height: 600,
      crop: {
        type: 'thumb',
        source: true
      }
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(`image/upload/c_${options.crop.type},w_${options.width},h_${options.height},g_auto`);
  });

  it('should crop as thumb in 2 stages with aspect ratio', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      height: 600,
      crop: {
        type: 'thumb',
        aspectRatio: '16:9',
        source: true
      }
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });

    expect(resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(`image/upload/c_${options.crop.type},ar_${options.crop.aspectRatio},g_auto`);
  });

  it('should resize based on crop parameter', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      crop: {
        width: 600
      }
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });

    expect(resize).toContain(`c_limit,w_${options.crop.width}`);
  });

  it('should resize in two stages', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      crop: {
        width: 600,
        height: 500,
        type: 'thumb',
        source: true
      }
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });

    expect(resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(`image/upload/c_${options.crop.type},w_${options.crop.width},h_${options.crop.height},g_auto`);
  });

  it('should crop in two stages with array of single configuration', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      height: 5678,
      width: 1234,
      crop: [{
        type: 'auto',
        height: 8765,
        width: 4321,
        zoom: 3,
        gravity: 'center'
      }]
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });

    expect(resize).toContain(`c_${options.crop[0].type},w_${options.crop[0].width},h_${options.crop[0].height},g_${options.crop[0].gravity},z_${options.crop[0].zoom}`);
  });

  it('should crop in two stages with array configurations inferring width/height', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      height: 5678,
      width: 1234,
      crop: [
        {
          type: 'thumb',
          source: true
        },
        {
          type: 'scale'
        }
      ]
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });

    expect(resize).toContain(`c_${options.crop[1].type},w_${options.width},h_${options.height}`);

    expect(cldImage.toURL()).toContain(`image/upload/c_${options.crop[0].type},w_${options.width},h_${options.height},g_auto`);
  });

  it('should not apply a height when crop is fill if isnt set', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      crop: 'fill',
    };
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_${options.crop},w_${options.width},g_auto`);
  });

  it('should apply aspect ratio as a string and valid crop', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      aspectRatio: '16:9',
      crop: 'fill'
    };
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toContain(`c_fill,ar_16:9,g_auto`);
  });

  it('should apply aspect ratio as a float and valid crop', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      aspectRatio: .5,
      crop: 'fill'
    };
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    // for my own sanity that float => string will add the leading 0
    expect(`${options.aspectRatio}`).toMatch('0.5');
    expect(resize).toContain(`c_fill,ar_${options.aspectRatio},g_auto`);
  });

  it('should not apply aspect ratio if not a valid crop', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      aspectRatio: '16:9',
      crop: 'fit'
    };
    const { options: { resize } } = plugin({ cldAsset: cldImage, options });
    expect(resize).toBeUndefined();
  });
});
