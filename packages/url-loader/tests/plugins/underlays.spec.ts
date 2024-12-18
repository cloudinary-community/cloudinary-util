import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { UnderlaysPlugin } from "../../src/plugins/underlays.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Underlays", () => {
    it("should add an underlay configured by object", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/galaxy";
      const width = 1920;
      const height = 1200;
      const crop = "fill";

      const options = {
        src: TEST_PUBLIC_ID,
        underlays: [
          {
            publicId,
            width,
            height,
            crop,
          },
        ],
      } as const;

      UnderlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `u_${publicId.replace(/\//g, ":")},w_${width},h_${height},c_${crop}/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });

    it("should add an underlay by string", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const publicId = "images/galaxy";
      const width = "1.0";
      const height = "1.0";
      const crop = "fill";

      const options = {
        src: TEST_PUBLIC_ID,
        underlay: publicId,
      };

      UnderlaysPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `u_${publicId.replace(/\//g, ":")},c_${crop},w_${width},h_${height},fl_relative/fl_layer_apply,fl_no_overflow/${TEST_PUBLIC_ID}`,
      );
    });
  });
});
