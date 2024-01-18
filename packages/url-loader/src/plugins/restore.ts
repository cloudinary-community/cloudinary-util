import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const props = {
  restore: z.boolean()
    .describe(JSON.stringify({
      text: 'Uses generative AI to restore details in poor quality images or images that may have become degraded through repeated processing and compression.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_gen_restore'
    }))
    .optional(),
};

export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { restore = false } = options;

  if ( restore ) {
    cldAsset.effect('e_gen_restore');
  }

  return {};
}