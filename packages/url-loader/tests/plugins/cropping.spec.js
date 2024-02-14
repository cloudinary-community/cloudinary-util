import { describe, it, expect } from 'vitest';
import { Cloudinary } from '@cloudinary/url-gen';

import * as croppingPlugin from '../../src/plugins/cropping';

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

  it('should return resize override width a base width', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      baseWidth: 600,
      width: 900,
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });

    expect(resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(`image/upload/c_limit,w_${options.baseWidth}`);
  });

  it('should return resize override width a base width', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      baseCrop: 'auto',
      baseHeight: 8765,
      baseWidth: 4321,
      baseZoom: 3,
      crop: 'fill',
      height: 5678,
      width: 1234,
      zoom: 2,
    };

    const { options: { resize } } = plugin({ cldAsset: cldImage, options });

    expect(resize).toContain(`c_${options.crop},w_${options.width},h_${options.height},g_auto,z_${options.zoom}`);
    expect(cldImage.toURL()).toContain(`image/upload/c_${options.baseCrop},w_${options.baseWidth},h_${options.baseHeight},g_auto,z_${options.baseZoom}`);
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
