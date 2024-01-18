import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const props = {
  removeBackground: z.boolean()
    .describe(JSON.stringify({
      text: 'Removes the background of an image using the Cloudinary AI Background Removal Add-On (Required).',
      url: 'https://cloudinary.com/documentation/cloudinary_ai_background_removal_addon'
    }))
    .optional(),
};

export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { removeBackground = false } = options;
  if ( removeBackground ) {
    cldAsset.effect('e_background_removal');
  }
  return {};
}