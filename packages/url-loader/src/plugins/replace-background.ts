import { z } from "zod";
import type { ImageOptions } from "../types/image.js";
import type { TransformationPlugin } from "../types/plugins.js";

export const replaceBackgroundProps = {
  replaceBackground: z
    .union([
      z.boolean(),
      z.string(),
      z.object({
        seed: z.number().optional(),
        prompt: z.string().optional(),
      }),
    ])
    .describe(
      JSON.stringify({
        text: "Replaces the background of an image with an AI-generated background.",
        url: "https://cloudinary.com/documentation/transformation_reference#e_gen_background_replace",
      })
    )
    .optional(),
};

export const replaceBackgroundPlugin = {
  props: replaceBackgroundProps,
  assetTypes: ["image", "images"],
  plugin: (settings) => {
    const { cldAsset, options } = settings;
    const { replaceBackground } = options;

    if (replaceBackground === false || typeof replaceBackground === "undefined") return {};

    const properties = [];

    if ( typeof replaceBackground === 'object' ) {

      if ( typeof replaceBackground.prompt !== 'undefined' ) {
        properties.push(`prompt_${replaceBackground.prompt}`);
      }

      if ( typeof replaceBackground.seed === 'number' ) {
        properties.push(`seed_${replaceBackground.seed}`);
      }      
    } else if ( typeof replaceBackground === 'string' ) {
      properties.push(`prompt_${replaceBackground}`);
    }

    let transformation = 'e_gen_background_replace';

    if ( properties.length > 0 ) {
      transformation = `${transformation}:${properties.join(';')}`;
    }

    cldAsset.addTransformation(transformation);

    return {};
  },
} satisfies TransformationPlugin<ImageOptions>;
