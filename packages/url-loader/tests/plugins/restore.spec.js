import { Cloudinary } from '@cloudinary/url-gen';
import { describe, expect, it } from 'vitest';

import { restorePlugin } from '../../src/plugins/restore';

const { plugin } = restorePlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Plugins', () => {
  describe('Generative Restore', () => {
    it('should restore', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        restore: true
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`e_gen_restore`);
    });

    it('should not restore', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      plugin({
        cldAsset: cldImage,
        options: {}
      });

      expect(cldImage.toURL()).not.toContain(`e_gen_restore`);
    });

  });
});
