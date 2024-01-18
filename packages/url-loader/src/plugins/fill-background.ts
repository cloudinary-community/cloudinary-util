import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

import { crop, gravity } from '../constants/parameters';

export const props = {
  fillBackground: z.union([
      z.boolean(),
      z.object({
        crop: crop.schema.optional(),
        gravity: gravity.schema.optional(),
        prompt: z.string().optional()
      })
    ])
    .describe(JSON.stringify({
      text: 'Uses Generative Fill to extended padded image with AI',
      url: 'https://cloudinary.com/documentation/transformation_reference#b_gen_fill'
    }))
    .optional()
};

export const assetTypes = ['image', 'images'];

const defaultCrop = 'pad';

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { fillBackground } = options;

  if ( fillBackground === true ) {
    const properties = [
      'b_gen_fill',
      `ar_${options.width}:${options.height}`,
      `w_${options.width}`,
      `c_${defaultCrop}`
    ]

    cldAsset.addTransformation(properties.join(','));
  } else if ( typeof fillBackground === 'object' ) {
    const { crop = defaultCrop, gravity, prompt } = fillBackground;

    const properties = [
      `ar_${options.width}:${options.height}`,
      `w_${options.width}`,
      `c_${crop}`
    ]

    if ( typeof prompt === 'string' ) {
      properties.unshift(`b_gen_fill:${prompt}`);
    } else {
      properties.unshift(`b_gen_fill`);
    }

    if ( typeof gravity === 'string' ) {
      properties.push(`g_${gravity}`);
    }

    cldAsset.addTransformation(properties.join(','));
  }

  return {};
}