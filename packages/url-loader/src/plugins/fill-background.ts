import { normalizeNumberParameter } from "@cloudinary-util/util";
import type {
  CropMode,
  Gravity,
  ListablePrompts,
} from "../constants/parameters.js";
import { plugin } from "../lib/plugin.js";

const defaultCrop = "pad";

export declare namespace FillBackgroundPlugin {
  export interface Options {
    /**
     * @description Uses Generative Fill to extended padded image with AI
     * @url https://cloudinary.com/documentation/transformation_reference#b_gen_fill
     */
    fillBackground?: boolean | NestedOptions;
  }

  export interface NestedOptions {
    crop?: CropMode;
    gravity?: Gravity;
    prompt?: ListablePrompts;
  }
}

export const FillBackgroundPlugin = plugin({
  name: "FillBackground",
  supports: "image",
  apply: (cldAsset, options) => {
    const { fillBackground } = options;

    if (typeof fillBackground === "undefined") return {};

    const width = normalizeNumberParameter(options.width);
    const height = normalizeNumberParameter(options.height);
    const hasDefinedDimensions =
      typeof height === "number" && typeof width === "number";
    let aspectRatio = options.aspectRatio;

    if (!aspectRatio && hasDefinedDimensions) {
      aspectRatio = `${width}:${height}`;
    }

    if (!aspectRatio) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Could not determine aspect ratio based on available options to use fillBackground. Please specify width and height or an aspect ratio.`,
        );
      }
      return {};
    }

    if (fillBackground === true) {
      const properties = [
        "b_gen_fill",
        `ar_${aspectRatio}`,
        `c_${defaultCrop}`,
      ];

      cldAsset.addTransformation(properties.join(","));
    } else if (typeof fillBackground === "object") {
      const { crop = defaultCrop, gravity, prompt } = fillBackground;

      const properties = [`ar_${aspectRatio}`, `c_${crop}`];

      if (typeof prompt === "string") {
        properties.unshift(`b_gen_fill:${prompt}`);
      } else {
        properties.unshift(`b_gen_fill`);
      }

      if (typeof gravity === "string") {
        properties.push(`g_${gravity}`);
      }

      cldAsset.addTransformation(properties.join(","));
    }

    return {};
  },
});
