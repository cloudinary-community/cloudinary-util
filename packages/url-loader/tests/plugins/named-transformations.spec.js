import { Cloudinary } from '@cloudinary/url-gen';
import { describe, expect, it } from 'vitest';

import { namedTransformationsPlugin } from '../../src/plugins/named-transformations';

const { plugin } = namedTransformationsPlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Plugins', () => {
  describe('Named Transformations', () => {
    it('should apply a single named transformation to a Cloudinary URL', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        namedTransformations: 'my-transformation'
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`t_${options.namedTransformations}/${TEST_PUBLIC_ID}`);
    });

    it('should apply an array of named transformations to a Cloudinary URL', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        namedTransformations: [
          'my-transformation',
          'my-other-transformation'
        ]
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`t_${options.namedTransformations.join('/t_')}/${TEST_PUBLIC_ID}`);
    })
  });

  // @todo - deprecate in favor of namedTransformations

  describe('Named Transformations', () => {
    it('should apply a single named transformation to a Cloudinary URL', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        transformations: 'my-transformation'
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`t_${options.transformations}/${TEST_PUBLIC_ID}`);
    });

    it('should apply an array of named transformations to a Cloudinary URL', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        transformations: [
          'my-transformation',
          'my-other-transformation'
        ]
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`t_${options.transformations.join('/t_')}/${TEST_PUBLIC_ID}`);
    })
  });
});