import { Cloudinary } from '@cloudinary/url-gen';
import { describe, expect, it } from 'vitest';

import { removeBackgroundPlugin } from '../../src/plugins/remove-background';

const { plugin } = removeBackgroundPlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Plugins', () => {
  describe('Remove Background', () => {
    it('should remove the background', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        removeBackground : true
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`e_background_removal`);
    });

    it('should not remove the background', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      plugin({
        cldAsset: cldImage,
        options: {}
      });

      expect(cldImage.toURL()).not.toContain(`e_background_removal`);
    });

  });
});
