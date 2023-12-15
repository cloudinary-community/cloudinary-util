import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const pluginProps = {
  fillBackground: z.union([
      z.boolean(),
      z.object({
        crop: z.string().optional(),
        gravity: z.string().optional(),
        prompt: z.string().optional()
      })
    ])
    .describe(JSON.stringify({
      text: 'Uses Generative Fill to extended padded image with AI',
      url: 'https://cloudinary.com/documentation/transformation_reference#b_gen_fill'
    }))
    .optional()
};

// @todo: no longer need props in each file, grab from pluginProps
export const props = Object.entries(pluginProps).map(([name]) => name);
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
    const { crop = defaultCrop, gravity, prompt } = fillBackground

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