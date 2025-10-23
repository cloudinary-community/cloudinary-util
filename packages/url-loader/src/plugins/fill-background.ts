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
    seed?: number;
  }
}

export const FillBackgroundPlugin = /* #__PURE__ */ plugin({
  name: "FillBackground",
  supports: "image",
  inferOwnOptions: {} as FillBackgroundPlugin.Options,
  props: {
    fillBackground: true,
  },
  apply: (cldAsset, opts, ctx) => {
    const { fillBackground } = opts;

    if (typeof fillBackground === "undefined") return {};

    const width = normalizeNumberParameter(ctx.width);
    const height = normalizeNumberParameter(ctx.height);
    const hasDefinedDimensions =
      typeof height === "number" && typeof width === "number";
    let aspectRatio = ctx.aspectRatio;

    if (!aspectRatio && hasDefinedDimensions) {
      aspectRatio = `${width}:${height}`;
    }

    if (!aspectRatio) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Could not determine aspect ratio based on available options to use fillBackground. Please specify width and height or an aspect ratio.`
        );
      }
      return {};
    }

    if (fillBackground === true) {
      // Add c_limit transformation to handle images larger than 25MP
      cldAsset.addTransformation("c_limit,w_5000,h_5000");

      const properties = [
        "b_gen_fill",
        `ar_${aspectRatio}`,
        `c_${defaultCrop}`,
      ];

      cldAsset.addTransformation(properties.join(","));
    } else if (typeof fillBackground === "object") {
      const { crop = defaultCrop, gravity, prompt, seed } = fillBackground;

      // Add c_limit transformation to handle images larger than 25MP
      cldAsset.addTransformation("c_limit,w_5000,h_5000");

      const bGenFillProperties = [];

      if (typeof prompt === "string") {
        bGenFillProperties.push(`prompt_${prompt}`);
      }

      if (typeof seed === "number") {
        bGenFillProperties.push(`seed_${seed}`);
      }

      const bGenFill = ( 
        bGenFillProperties.length > 0 
        ? `b_gen_fill:${bGenFillProperties.join(';')}`
        : "b_gen_fill"
      );

      const properties = [ bGenFill, `ar_${aspectRatio}`, `c_${crop}`];

      if (typeof gravity === "string") {
        properties.push(`g_${gravity}`);
      }

      cldAsset.addTransformation(properties.join(","));
    }

    return {};
  },
});
