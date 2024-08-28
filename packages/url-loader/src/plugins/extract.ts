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

    if ( typeof extract === 'string' ) {
      properties.push(`prompt_${extract}`);
    } else if ( Array.isArray(extract) ) {
      properties.push(`prompt_${formatPrompts(extract)}`);
    } else if ( typeof extract === 'object' && !Array.isArray(extract) ) {
      const prompt = formatPrompts(extract.prompt);

      if ( prompt ) {
        properties.push(`prompt_${prompt}`);
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
    }

    if ( properties.length > 0 ) {
      const transformation = `e_extract:${properties.join(';')}`;
      cldAsset.addTransformation(transformation);
    }

    return {};
  },
} satisfies TransformationPlugin<ImageOptions>;

/**
 * formatPrompts
 */

function formatPrompts(prompt: string | Array<string> | undefined) {
  if ( typeof prompt === 'string' ) return prompt;

  if ( Array.isArray(prompt) ) {
    return `(${prompt.filter(prompt => typeof prompt === 'string').join(';')})`;
  }

  return undefined;
}