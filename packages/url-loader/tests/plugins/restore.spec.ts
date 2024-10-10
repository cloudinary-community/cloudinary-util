import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { RestorePlugin } from "../../src/plugins/restore.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Generative Restore", () => {
    it("should restore", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        restore: true,
      };

      RestorePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`e_gen_restore`);
    });

    it("should not restore", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
      };

      RestorePlugin.apply(cldImage, options);

      expect(cldImage.toURL()).not.toContain(`e_gen_restore`);
    });
  });
});
