import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from 'vitest';

import { extractPlugin } from "../../src/plugins/extract";

const { plugin } = extractPlugin;

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Extract", () => {
    it("should extract by single prompt", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        extract: 'space jellyfish',
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`/e_extract:prompt_${encodeURIComponent(options.extract)}/`);
    });

    it("should extract by array of prompts", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        extract: ['space jellyfish', 'octocat'],
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`/e_extract:prompt_(${options.extract.map(p => encodeURIComponent(p)).join(';')})/`);
    });

    it("should extract by object", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        extract: {
          prompt: 'space jellyfish',
          multiple: true,
          mode: 'mask',
          invert: true
        },
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`/e_extract:prompt_${encodeURIComponent(options.extract.prompt)};invert_${options.extract.invert};mode_${options.extract.mode};multiple_${options.extract.multiple}/`);
    });
  });
});
