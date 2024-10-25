import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";
import { ZoompanPlugin } from "../../src/plugins/zoompan.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Zoom pan", () => {
    it('should add "e_zoompan"', () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        zoompan: true,
      };

      const result = ZoompanPlugin.apply(cldImage, options);

      expect(result.options?.format).toBe("auto:animated");
      expect(cldImage.toURL()).toContain(`e_zoompan`);
    });

    it("should not zoom pan", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
      };

      ZoompanPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).not.toContain(`e_zoompan`);
    });

    it("should add loop effect ", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        zoompan: "loop",
      };

      ZoompanPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`e_zoompan`);
      expect(cldImage.toURL()).toContain(`e_loop`);
    });

    it("should add a custom zoompan", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        zoompan: "mode_ofc;maxzoom_3.2;du_5;fps_30",
      };

      ZoompanPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`e_zoompan:${options.zoompan}`);
    });

    it("should add a custom options", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        zoompan: {
          loop: true,
          options: "to_(g_auto;zoom_1.4)",
        },
      };

      ZoompanPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `e_zoompan:${options.zoompan.options}`,
      );
      expect(cldImage.toURL()).toContain("e_loop");
    });

    it("should add a custom loop option", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        zoompan: {
          options: "string",
          loop: 15,
        },
      };

      ZoompanPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `e_zoompan:${options.zoompan.options}/e_loop:${options.zoompan.loop}`,
      );
    });

    it("should not override format", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        zoompan: false,
      };

      const result = ZoompanPlugin.apply(cldImage, options);

      expect(result.options?.format).toBe(undefined);
    });
  });
});
