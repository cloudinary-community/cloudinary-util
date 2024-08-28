import { z } from "zod";
import { extractMode, multiple, prompt } from '../constants/parameters.js';
import type { ImageOptions } from "../types/image.js";
import type { TransformationPlugin } from "../types/plugins.js";

export const extractProps = {
  extract: z
    .union([
      prompt.schema.optional(),
      z.array(prompt.schema).optional(),
      z.object({
        invert: z.boolean().default(false).optional(),
        mode: extractMode.schema.optional(),
        multiple: multiple.schema.default(false).optional(),
        prompt: z.union([prompt.schema, z.array(prompt.schema)]).optional(),
      }),
    ])
    .describe(
      JSON.stringify({
        text: "Extracts an area or multiple areas of an image, described in natural language.",
        url: "https://cloudinary.com/documentation/transformation_reference#e_extract",
      })
    )
    .optional(),
};

export const extractPlugin = {
  props: extractProps,
  assetTypes: ["image", "images"],
  plugin: (settings) => {
    const { cldAsset, options } = settings;
    const { extract } = options;

    if (!extract || typeof extract === "undefined") return {};

    const properties = [];

    if ( typeof extract === 'object' && !Array.isArray(extract) ) {

      if ( typeof extract.prompt === 'string' ) {
        properties.push(`prompt_${extract.prompt}`);
      } else if ( Array.isArray(extract.prompt) ) {
        const prompts = extract.prompt.filter(prompt => typeof prompt === 'string').join(';');
        properties.push(`prompt_(${prompts})`);
      }

      if ( extract.invert === true ) {
        properties.push('invert_true');
      }

      if ( typeof extract.mode === 'string' ) {
        properties.push(`mode_${extract.mode}`);
      }

      if ( extract.multiple === true ) {
        properties.push('multiple_true');
      }

    } else if ( typeof extract === 'string' ) {
      properties.push(`prompt_${extract}`);
    } else if ( Array.isArray(extract) ) {
      const prompts = extract.filter(prompt => typeof prompt === 'string').join(';');
      properties.push(`prompt_(${prompts})`);
    }

    if ( properties.length > 0 ) {
      const transformation = `e_extract:${properties.join(';')}`;
      cldAsset.addTransformation(transformation);
    }

    return {};
  },
} satisfies TransformationPlugin<ImageOptions>;