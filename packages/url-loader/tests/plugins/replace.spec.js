import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from 'vitest';

import { replacePlugin } from "../../src/plugins/replace";

const { plugin } = replacePlugin;

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Generative Replace", () => {
    it("should replace with object", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        replace: {
          from: "apple",
          to: "orange",
        },
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_replace:from_apple;to_orange`);
    });

    it("should replace with object and preserved geometry", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        replace: {
          from: "apple",
          to: "orange",
          preserveGeometry: true,
        },
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(
        `e_gen_replace:from_apple;to_orange;preserve-geometry_true`
      );
    });

    it("should replace with array", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        replace: ["apple", "orange"],
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(`e_gen_replace:from_apple;to_orange`);
    });

    it("should replace with array and preserved geometry", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        replace: ["apple", "candy bar", "true"],
      };

      plugin({
        cldAsset: cldImage,
        options,
      });

      expect(cldImage.toURL()).toContain(
        `e_gen_replace:from_apple;to_candy%20bar;preserve-geometry_true`
      );
    });

    it("should not attempt generative replace", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      plugin({
        cldAsset: cldImage,
        options: {},
      });

      expect(cldImage.toURL()).not.toContain(`e_gen_replace`);
    });
  });
});
