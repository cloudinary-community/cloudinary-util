import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from 'vitest';

import { recolorPlugin } from "../../src/plugins/recolor";

const { plugin } = recolorPlugin;

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Recolor", () => {
    it("should recolor an object by Array", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        recolor: ['duck', 'blue']
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_recolor:prompt_duck;to-color_blue`);
    });

    it("should recolor multiple objects by an array", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        recolor: [['duck', 'horse'], 'blue']
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_recolor:prompt_(duck;horse);to-color_blue`);
    });

    it("should recolor an object by object configuration", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        recolor: {
          prompt: 'duck',
          to: 'blue',
          multiple: true
        }
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_recolor:prompt_duck;to-color_blue;multiple_true`);
    });

    it("should recolor multiple objects by object configuration", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        recolor: {
          prompt: ['duck', 'horse'],
          to: 'blue',
        }
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_recolor:prompt_(duck;horse);to-color_blue`);
    });

  });
});
