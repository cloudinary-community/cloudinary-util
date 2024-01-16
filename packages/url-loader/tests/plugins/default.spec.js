import { vi, describe, it, expect, afterEach } from 'vitest';
import { Cloudinary } from '@cloudinary/url-gen';

import * as defaultImage from '../../src/plugins/default-image';

const { plugin } = defaultImage

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

global.console = {
  ...global.console,
  warn: vi.fn()
}

describe('Default Image plugin', () => {
  afterEach(() => {
    // Clears the state of console.warn, in case multiple tests want to monitor it
    vi.restoreAllMocks()
  });

  it('should add a default image', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      height: 100,
      defaultImage: 'my-image.jpg'
    };
    plugin({ cldAsset: cldImage, options });
    expect(cldImage.toURL()).toContain(`d_${options.defaultImage}/${TEST_PUBLIC_ID}`);
  });
  it('should warn if no format', () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      width: 100,
      height: 100,
      defaultImage: 'my-image'
    };
    plugin({ cldAsset: cldImage, options });
    expect(console.warn.mock.calls[0][0]).toContain('The defaultImage prop may be missing');
    expect(cldImage.toURL()).toContain(`d_${options.defaultImage}/${TEST_PUBLIC_ID}`);
  });
});
