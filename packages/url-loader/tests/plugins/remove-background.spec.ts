import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { RemoveBackgroundPlugin } from "../../src/plugins/remove-background.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Remove Background", () => {
    it("should remove the background", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        removeBackground: true,
      };

      RemoveBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`e_background_removal`);
    });
  });
});
