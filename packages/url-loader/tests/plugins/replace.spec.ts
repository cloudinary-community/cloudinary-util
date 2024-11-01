import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { ReplacePlugin } from "../../src/plugins/replace.js";

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
        src: TEST_PUBLIC_ID,
        replace: {
          from: "apple",
          to: "orange",
        },
      };

      ReplacePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`e_gen_replace:from_apple;to_orange`);
    });

    it("should replace with object and preserved geometry", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        replace: {
          from: "apple",
          to: "orange",
          preserveGeometry: true,
        },
      };

      ReplacePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `e_gen_replace:from_apple;to_orange;preserve-geometry_true`,
      );
    });

    it("should replace with array", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        replace: ["apple", "orange"],
      };

      ReplacePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`e_gen_replace:from_apple;to_orange`);
    });

    it("should replace with array and preserved geometry", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        replace: ["apple", "candy bar", "true"],
      };

      ReplacePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `e_gen_replace:from_apple;to_candy%20bar;preserve-geometry_true`,
      );
    });
  });
});
