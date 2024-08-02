import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from 'vitest';

import { replaceBackgroundPlugin } from "../../src/plugins/replace-background";

const { plugin } = replaceBackgroundPlugin;

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Generative Replace Background", () => {
    it("should replace the background", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        replaceBackground: true,
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain('/e_gen_background_replace/');
    });

    it("should replace the background with a prompt", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        replaceBackground: 'space jellyfish in space',
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`/e_gen_background_replace:prompt_${encodeURIComponent(options.replaceBackground)}/`);
    });

    it("should replace the background with a prompt", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        replaceBackground: {
          prompt: 'space jellyfish in outer space',
          seed: 2
        }
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`/e_gen_background_replace:prompt_${encodeURIComponent(options.replaceBackground.prompt)};seed_${options.replaceBackground.seed}/`);
    });
  });
});
