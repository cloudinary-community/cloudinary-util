import { Cloudinary } from '@cloudinary/url-gen';
import { describe, expect, it } from 'vitest';

import { preserveTransformationsPlugin } from '../../src/plugins/preserve-transformations';

const { plugin } = preserveTransformationsPlugin

const cloudName = 'test-cloud-name';

const cld = new Cloudinary({
  cloud: {
    cloudName
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Plugins', () => {
  describe('Preserve Transformations', () => {
    it('should preserve transformations from an existing URL ', () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const cloudName = 'customtestcloud';
      const transformations = ['c_limit,w_100', 'f_auto', 'q_auto'];
      const url = `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join('/')}/v1234/turtle`;

      const options = {
        src: url,
        preserveTransformations: true
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`/image/upload/${transformations.join('/')}/`);
    });
  });
});