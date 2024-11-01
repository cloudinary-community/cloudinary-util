import { plugin } from "../lib/plugin.js";

export declare namespace ReplaceBackgroundPlugin {
  export interface Options {
    /**
     * @description Replaces the background of an image with an AI-generated background.
     * @url https://cloudinary.com/documentation/transformation_reference#e_gen_background_replace
     */
    replaceBackground?: NestedOptions | string | boolean;
  }

  export interface NestedOptions {
    prompt?: string;
    seed?: number;
  }
}

export const ReplaceBackgroundPlugin = /* #__PURE__ */ plugin({
  name: "ReplaceBackground",
  supports: "image",
  inferOwnOptions: {} as ReplaceBackgroundPlugin.Options,
  props: {
    replaceBackground: true,
  },
  apply: (cldAsset, opts) => {
    const { replaceBackground } = opts;

    if (!replaceBackground) return {};

    const properties = [];

    if (typeof replaceBackground === "object") {
      if (typeof replaceBackground.prompt !== "undefined") {
        properties.push(`prompt_${replaceBackground.prompt}`);
      }

      if (typeof replaceBackground.seed === "number") {
        properties.push(`seed_${replaceBackground.seed}`);
      }
    } else if (typeof replaceBackground === "string") {
      properties.push(`prompt_${replaceBackground}`);
    }

    let transformation = "e_gen_background_replace";

    if (properties.length > 0) {
      transformation = `${transformation}:${properties.join(";")}`;
    }

    cldAsset.addTransformation(transformation);

    return {};
  },
});
