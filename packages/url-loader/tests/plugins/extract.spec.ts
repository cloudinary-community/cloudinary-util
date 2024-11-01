import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { ExtractPlugin } from "../../src/plugins/extract.js";

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
        src: TEST_PUBLIC_ID,
        extract: "space jellyfish",
      };

      ExtractPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `/e_extract:prompt_${encodeURIComponent(options.extract)}/`,
      );
    });

    it("should not add extract if no options detected", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        extract: {},
      };

      ExtractPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).not.toContain(`/e_extract/`);
    });

    it("should extract by array of prompts", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        extract: ["space jellyfish", "octocat"],
      };

      ExtractPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `/e_extract:prompt_(${options.extract.map((p) => encodeURIComponent(p)).join(";")})/`,
      );
    });

    it("should extract by object", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        extract: {
          prompt: "space jellyfish",
          multiple: true,
          mode: "mask",
          invert: true,
        },
      } as const;

      ExtractPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `/e_extract:prompt_${encodeURIComponent(options.extract.prompt)};invert_${options.extract.invert};mode_${options.extract.mode};multiple_${options.extract.multiple}/`,
      );
    });

    it("should extract by object with array of prompts", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        extract: {
          prompt: ["space jellyfish", "octocat"],
          mode: "mask",
        },
      } as const;

      ExtractPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `/e_extract:prompt_(${options.extract.prompt.map((p) => encodeURIComponent(p)).join(";")});mode_${options.extract.mode}/`,
      );
    });
  });
});
