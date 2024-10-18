import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { RawTransformationsPlugin } from "../../src/plugins/raw-transformations.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Raw Transformations", () => {
    it("should apply a single raw transformations to the end of a Cloudinary URL", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        rawTransformations: ["e_blur:2000"],
      };

      RawTransformationsPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `${options.rawTransformations.join("/")}/${TEST_PUBLIC_ID}`,
      );
    });

    it("should apply an array of raw transformations to the end of a Cloudinary URL", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        rawTransformations: ["e_blur:2000", "e_tint:100:0000FF:0p:FF1493:100p"],
      };

      RawTransformationsPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `${options.rawTransformations.join("/")}/${TEST_PUBLIC_ID}`,
      );
    });
  });
});
