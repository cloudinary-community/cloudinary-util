import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";
import { SanitizePlugin } from "../../src/plugins/sanitize.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

describe("Cloudinary Sanitize", () => {
  describe("constructCloudinaryUrl", () => {
    it("should include fl_sanitize when display image source name end with svg", () => {
      const src = "turtle.svg";
      const cldImage = cld.image(src);
      SanitizePlugin.apply(cldImage, {
        src,
      });
      expect(cldImage.toURL()).toContain(`image/upload/fl_sanitize/turtle.svg`);
    });

    it("should include fl_sanitize and f_svg when display format is svg", () => {
      const src = "turtle";
      const cldImage = cld.image(src);
      SanitizePlugin.apply(cldImage, {
        format: "svg",
        src,
      });
      expect(cldImage.toURL()).toContain(`image/upload/fl_sanitize/turtle`);
    });

    it("should include fl_sanitize and f_svg when display format svg image", () => {
      const src = "turtle.svg";
      const cldImage = cld.image(src);
      SanitizePlugin.apply(cldImage, {
        format: "svg",
        src,
      });
      expect(cldImage.toURL()).toContain(`image/upload/fl_sanitize/turtle.svg`);
    });

    it("should not include fl_sanitize when set option sanitize to false", () => {
      const src = "turtle.svg";
      const cldImage = cld.image(src);
      SanitizePlugin.apply(cldImage, {
        sanitize: false,
        src,
      });
      expect(cldImage.toURL()).toContain(`image/upload/turtle.svg`);
    });

    it("should not include fl_sanitize when display other image", () => {
      const src = "turtle";
      const cldImage = cld.image(src);
      SanitizePlugin.apply(cldImage, {
        src,
      });
      expect(cldImage.toURL()).toContain(`image/upload/turtle`);
    });
  });
});
