import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { EffectsPlugin } from "../../src/plugins/effects.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Plugins", () => {
  it("should apply effects ", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);

    const shear = "40:0";
    const opacity = "50";

    const options = {
      src: TEST_PUBLIC_ID,
      shear,
      opacity,
    };

    EffectsPlugin.apply(cldImage, options);

    expect(cldImage.toURL()).toContain(`/o_${opacity}/e_shear:${shear}/`);
  });
  it("should apply effects by array", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);

    const shear = "40:0";
    const gradientFade = true;
    const opacity = "50";
    const cartoonify = "50";
    const radius = "150";

    const options = {
      src: TEST_PUBLIC_ID,
      effects: [
        {
          shear,
          opacity,
        },
        {
          gradientFade,
          cartoonify,
          radius,
        },
      ],
    };

    EffectsPlugin.apply(cldImage, options);

    expect(cldImage.toURL()).toContain(
      `/o_${opacity},e_shear:${shear}/e_cartoonify:${cartoonify},e_gradient_fade,r_${radius}/`,
    );
  });

  it("should colorize with a hex color value", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);

    const color = "#ff00ff";
    const colorExpected = "rgb:ff00ff";
    const colorize = 50;

    const options = {
      src: TEST_PUBLIC_ID,
      effects: [
        {
          color,
          colorize,
        },
      ],
    };

    EffectsPlugin.apply(cldImage, options);

    expect(cldImage.toURL()).toContain(
      `/co_${colorExpected},e_colorize:${colorize}/`,
    );
  });
});
