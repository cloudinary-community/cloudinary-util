import { Cloudinary } from "@cloudinary/url-gen";
import { describe, expect, it } from "vitest";

import { CroppingPlugin } from "../../src/plugins/cropping.js";

const cld = new Cloudinary({
  cloud: {
    cloudName: "test-cloud-name",
  },
});

const TEST_PUBLIC_ID = "test-public-id";

describe("Cropping plugin", () => {
  it("should apply a crop and gravity to a URL", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 100,
      height: 100,
      crop: "crop",
      gravity: "auto",
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);
    expect(result.options?.resize).toContain(
      `c_${options.crop},w_${options.width},h_${options.height},g_${options.gravity}`,
    );
  });

  it("should apply a gravity of auto by default if not set explicitly", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 100,
      height: 100,
      crop: "fill",
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);
    expect(result.options?.resize).toContain(
      `c_${options.crop},w_${options.width},h_${options.height},g_auto`,
    );
  });

  it("should apply a zoom if set explicitly", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 100,
      height: 100,
      crop: "fill",
      zoom: 0.5,
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);
    expect(result.options?.resize).toContain(
      `c_${options.crop},w_${options.width},h_${options.height},g_auto,z_${options.zoom}`,
    );
  });

  it("should not include a width if not set", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);
    expect(result.options?.resize).toBeUndefined();
  });

  it("should crop as thumb instead of default with object syntax, width, and height", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 900,
      crop: {
        width: 100,
        height: 200,
        type: "thumb",
      },
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toContain(
      `c_${options.crop.type},w_${options.crop.width},h_${options.crop.height},g_auto`,
    );
  });

  it("should crop as thumb instead of default with object syntax with width inferred", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 900,
      height: 600,
      crop: {
        type: "thumb",
      },
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize as string).toContain(
      `c_${options.crop.type},w_${options.width},h_${options.height},g_auto`,
    );
  });

  it("should crop as thumb in 2 stages with width inferred", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 900,
      height: 600,
      crop: {
        type: "thumb",
        source: true,
      },
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options.resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(
      `image/upload/c_${options.crop.type},w_${options.width},h_${options.height},g_auto`,
    );
  });

  it("should crop as thumb in 2 stages with aspect ratio", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 900,
      height: 600,
      crop: {
        type: "thumb",
        aspectRatio: "16:9",
        source: true,
      },
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options.resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(
      `image/upload/c_${options.crop.type},ar_${options.crop.aspectRatio},g_auto`,
    );
  });

  it("should resize based on crop parameter", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 900,
      crop: {
        type: "limit",
        width: 600,
      },
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toContain(`c_limit,w_${options.crop.width}`);
  });

  it("should resize in two stages", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 900,
      crop: {
        width: 600,
        height: 500,
        type: "thumb",
        source: true,
      },
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(
      `image/upload/c_${options.crop.type},w_${options.crop.width},h_${options.crop.height},g_auto`,
    );
  });

  it("should crop in two stages with array of single configuration", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      height: 5678,
      width: 1234,
      crop: [
        {
          type: "auto",
          height: 8765,
          width: 4321,
          zoom: 3,
          gravity: "center",
        },
      ],
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options.resize).toContain(
      `c_${options.crop[0].type},w_${options.crop[0].width},h_${options.crop[0].height},g_${options.crop[0].gravity},z_${options.crop[0].zoom}`,
    );
  });

  it("should crop in two stages with array configurations inferring width/height", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      height: 5678,
      width: 1234,
      crop: [
        {
          type: "thumb",
          source: true,
        },
        {
          type: "scale",
        },
      ],
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options.resize).toContain(
      `c_${options.crop[1].type},w_${options.width},h_${options.height}`,
    );
    expect(cldImage.toURL()).toContain(
      `image/upload/c_${options.crop[0].type},w_${options.width},h_${options.height},g_auto`,
    );
  });

  it("should not apply a height when crop is fill if isnt set", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 100,
      crop: "fill",
    } as const;

    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toContain(
      `c_${options.crop},w_${options.width},g_auto`,
    );
  });

  it("should apply aspect ratio as a string and valid crop", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      aspectRatio: "16:9",
      crop: "fill",
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toContain(`c_fill,ar_16:9,g_auto`);
  });

  it("should apply aspect ratio as a float and valid crop", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      aspectRatio: 0.5,
      crop: "fill",
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);
    // for my own sanity that float => string will add the leading 0
    expect(`${options.aspectRatio}`).toMatch("0.5");

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toContain(
      `c_fill,ar_${options.aspectRatio},g_auto`,
    );
  });

  it("should not apply aspect ratio if not a valid crop", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      aspectRatio: "16:9",
      crop: "fit",
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);

    expect(result.options?.resize).toBeUndefined();
  });

  it("should apply coordinates-based cropping with x and y with no default gravity", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 123,
      height: 321,
      crop: {
        type: "crop",
        x: 50,
        y: 100,
      },
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toBe(
      `c_${options.crop.type},w_${options.width},h_${options.height},x_${options.crop.x},y_${options.crop.y}`,
    );
  });

  it("should apply coordinates-based cropping with custom gravity", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 123,
      height: 321,
      crop: {
        type: "crop",
        x: 4321,
        y: 1234,
        gravity: "south",
      },
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toBe(
      `c_${options.crop.type},w_${options.width},h_${options.height},x_${options.crop.x},y_${options.crop.y},g_${options.crop.gravity}`,
    );
  });

  it("should apply coordinates-based cropping with custom width and height", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 123,
      height: 321,
      crop: {
        type: "crop",
        x: 100,
        y: 100,
        width: 567,
        height: 765,
        gravity: "south",
      },
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toBe(
      `c_${options.crop.type},w_${options.crop.width},h_${options.crop.height},x_${options.crop.x},y_${options.crop.y},g_${options.crop.gravity}`,
    );
  });

  it("should crop by coordinates in 2 stages with width", () => {
    const cldImage = cld.image(TEST_PUBLIC_ID);
    const options = {
      src: TEST_PUBLIC_ID,
      width: 900,
      height: 600,
      crop: {
        type: "fill",
        x: 5687,
        y: 6543,
        source: true,
      },
    } as const;
    const result = CroppingPlugin.apply(cldImage, options);

    if (result.options?.resize === undefined)
      throw new Error(`Expected result.options.resize to not be undefined`);

    expect(result.options?.resize).toContain(`c_limit,w_${options.width}`);
    expect(cldImage.toURL()).toContain(
      `image/upload/c_${options.crop.type},w_${options.width},h_${options.height},x_${options.crop.x},y_${options.crop.y}`,
    );
  });
});
