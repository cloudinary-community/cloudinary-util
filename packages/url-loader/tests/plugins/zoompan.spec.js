import { describe, it, expect } from 'vitest';
import { Cloudinary } from '@cloudinary/url-gen';
import * as zoomPanPlugin from '../../src/plugins/zoompan';

const { plugin } = zoomPanPlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Plugins', () => {
  describe('Zoom pan', () => {
    it('should add "e_zoompan"', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        zoompan : true
      }

      const result = plugin({
        cldAsset: cldImage,
        options
      });

      expect(result.options.format).toBe('auto:animated');
      expect(cldImage.toURL()).toContain(`e_zoompan`);
    });

    it('should not zoom pan', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      plugin({
        cldAsset: cldImage,
        options: {}
      });

      expect(cldImage.toURL()).not.toContain(`e_zoompan`);
    });

    it('should add loop effect ', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        zoompan : "loop"
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`e_zoompan`);
      expect(cldImage.toURL()).toContain(`e_loop`);
    });

    it('should add a custom zoompan', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        zoompan : 'string'
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`e_zoompan:${options.zoompan}`);
    });

    it('should add a custom options', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        zoompan : {
          options: "string",
          loop: true
        }
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`e_zoompan${options.zoompan.options}`);
      expect(cldImage.toURL()).toContain('e_loop');
    });

    it('should add a custom loop option', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        zoompan : {
          options: "string",
          loop: "string"
        }
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`e_loop${options.zoompan.loop}`);
    });

    it('should not override format', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        zoompan : false
      }

      const result = plugin({
                      cldAsset: cldImage,
                      options
                    });

      expect(result.options.format).toBe(undefined);
    });

  });
});
