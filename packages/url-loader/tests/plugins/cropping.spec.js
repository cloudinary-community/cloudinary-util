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
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).toContain(`c_${options.crop},w_${options.width},h_${options.height},g_${options.gravity}/${TEST_PUBLIC_ID}`);
  });

  it('should apply a gravity of auto by default if not set explicitly', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      height: 100,
      crop: 'fill'
    };
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).toContain(`c_${options.crop},w_${options.width},h_${options.height},g_auto/${TEST_PUBLIC_ID}`);
  });

  it('should apply a zoom if set explicitly', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      height: 100,
      crop: 'fill',
      zoom: 0.5
    };
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).toContain(`c_${options.crop},w_${options.width},h_${options.height},g_auto,z_${options.zoom}/${TEST_PUBLIC_ID}`);
  });

  it('should not include a width if not set', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {};
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).toContain(`image/upload/${TEST_PUBLIC_ID}`);
  });

  it('should return resize override with original size in URL if resize is smaller than width', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      widthResize: 600
    };

    const { options: pluginOptions } = plugin({ cldAsset: cldImage, options });

    expect(cldImage.toURL()).toContain(`image/upload/c_limit,w_${options.width}/${TEST_PUBLIC_ID}`);
    expect(pluginOptions).toMatchObject({
      width: options.widthResize
    })
  });

  it('should not return resize override with original size in URL if resize is larger than width', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      widthResize: 1200
    };

    const { options: pluginOptions } = plugin({ cldAsset: cldImage, options });

    expect(cldImage.toURL()).toContain(`image/upload/c_limit,w_${options.width}/${TEST_PUBLIC_ID}`);
    expect(pluginOptions).toMatchObject({})
  });

  it('should not return resize override with original size in URL if resize is the same as width', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 900,
      widthResize: 900
    };

    const { options: pluginOptions } = plugin({ cldAsset: cldImage, options });

    expect(cldImage.toURL()).toContain(`image/upload/c_limit,w_${options.width}/${TEST_PUBLIC_ID}`);
    expect(pluginOptions).toMatchObject({})
  });

  it('should not apply a height when crop is fill if isnt set', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      crop: 'fill',
    };
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).toContain(`c_${options.crop},w_${options.width},g_auto/${TEST_PUBLIC_ID}`);
  });

  it('should apply aspect ratio as a string and valid crop', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      aspectRatio: '16:9',
      crop: 'fill'
    };
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).toContain(`c_fill,ar_16:9,g_auto/${TEST_PUBLIC_ID}`);
  });

  it('should apply aspect ratio as a float and valid crop', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      aspectRatio: .5,
      crop: 'fill'
    };
    plugin({ cldAsset: cldImage, options });
    // for my own sanity that float => string will add the leading 0
    expect(`${options.aspectRatio}`).toMatch('0.5');
    expect(cldImage.toURL()).toContain(`c_fill,ar_${options.aspectRatio},g_auto/${TEST_PUBLIC_ID}`);
  });

  it('should not apply aspect ratio if not a valid crop', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      aspectRatio: '16:9',
    };
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).not.toContain(`ar_16:9`);
  });

});
