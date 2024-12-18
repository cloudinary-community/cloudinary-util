import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { RemovePlugin } from "../../src/plugins/remove.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Remove", () => {
    it("should remove an object by string", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        remove: "apple",
      };

      RemovePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`e_gen_remove:prompt_apple`);
    });

    it("should remove an object by array", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        remove: ["apple", "banana", "orange"],
      };

      RemovePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `e_gen_remove:prompt_(apple;banana;orange)`,
      );
    });

    it("should remove an object with object configuration", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        remove: {
          prompt: ["apple", "banana"],
          multiple: true,
          removeShadow: true,
        },
      };

      RemovePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `e_gen_remove:prompt_(apple;banana);multiple_true;remove-shadow_true`,
      );
    });

    it("should remove an object with region", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        remove: {
          region: [300, 200, 1900, 3500],
        },
      };

      RemovePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`region_(x_300;y_200;w_1900;h_3500)`);
    });

    it("should remove an object with multi-level region", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        remove: {
          region: [
            [300, 200, 1900, 3500],
            [123, 321, 750, 500],
          ],
        },
      };

      RemovePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `region_((x_300;y_200;w_1900;h_3500);(x_123;y_321;w_750;h_500))`,
      );
    });

    it("should not allow both a prompt and a region", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        remove: {
          prompt: "apple",
          region: [
            [300, 200, 1900, 3500],
            [123, 321, 750, 500],
          ],
        },
      };

      expect(() => RemovePlugin.apply(cldImage, options)).toThrow(
        "Invalid remove options: you can not have both a prompt and a region. More info: https://cloudinary.com/documentation/transformation_reference#e_gen_remove",
      );
    });
  });
});
