import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { ReplaceBackgroundPlugin } from "../../src/plugins/replace-background.js";

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
        src: TEST_PUBLIC_ID,
        replaceBackground: {},
      };

      ReplaceBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain("/e_gen_background_replace/");
    });

    it("should replace the background with a prompt", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        replaceBackground: {
          prompt: "space jellyfish in space",
        },
      };

      ReplaceBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `/e_gen_background_replace:prompt_${encodeURIComponent(options.replaceBackground.prompt)}/`,
      );
    });

    it("should replace the background with a prompt", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        replaceBackground: {
          prompt: "space jellyfish in outer space",
          seed: 2,
        },
      };

      ReplaceBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `/e_gen_background_replace:prompt_${encodeURIComponent(options.replaceBackground.prompt)};seed_${options.replaceBackground.seed}/`,
      );
    });
  });
});
