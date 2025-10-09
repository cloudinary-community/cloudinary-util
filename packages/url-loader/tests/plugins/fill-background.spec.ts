import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { FillBackgroundPlugin } from "../../src/plugins/fill-background.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  describe("Fill Background", () => {
    it("should generate a background with basic settings", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        width: 800,
        height: 600,
        fillBackground: true,
      };

      FillBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `b_gen_fill,ar_${options.width}:${options.height},c_pad/${TEST_PUBLIC_ID}`,
      );
    });

    it("should generate with custom options", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        width: 800,
        height: 600,
        fillBackground: {
          gravity: "east",
          prompt: "pink and purple flowers",
          crop: "mpad",
          seed: 3
        },
      } as const;

      FillBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `b_gen_fill:prompt_${encodeURIComponent(options.fillBackground.prompt)};seed_3,ar_${options.width}:${options.height},c_${options.fillBackground.crop},g_${options.fillBackground.gravity}/${TEST_PUBLIC_ID}`,
      );
    });

    it("should generate with just a seed but no prompt", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        width: 800,
        height: 600,
        fillBackground: {
          crop: 'pad',
          seed: 3
        },
      } as const;

      FillBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `b_gen_fill:seed_3,ar_${options.width}:${options.height},c_${options.fillBackground.crop}/${TEST_PUBLIC_ID}`,
      );
    });

    it("should generate with just a prompt but no seed", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        width: 800,
        height: 600,
        fillBackground: {
          crop: 'pad',
          prompt: 'a herd of llamas'
        },
      } as const;

      FillBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `b_gen_fill:prompt_${encodeURIComponent(options.fillBackground.prompt)},ar_${options.width}:${options.height},c_${options.fillBackground.crop}/${TEST_PUBLIC_ID}`,
      );
    });

    it("should not add generative fill if does not include aspect ratio", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        fillBackground: true,
      };

      FillBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(`image/upload/${TEST_PUBLIC_ID}`);
    });

    it("should add c_limit transformation before b_gen_fill to handle images larger than 25MP", () => {
      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        src: TEST_PUBLIC_ID,
        width: 800,
        height: 600,
        fillBackground: {
          gravity: "east",
          prompt: "pink and purple flowers",
          crop: "mpad",
          seed: 3
        },
      } as const;

      FillBackgroundPlugin.apply(cldImage, options);

      expect(cldImage.toURL()).toContain(
        `c_limit,w_5000,h_5000/b_gen_fill:prompt_${encodeURIComponent(options.fillBackground.prompt)};seed_3`
      );
    });
  });
});
