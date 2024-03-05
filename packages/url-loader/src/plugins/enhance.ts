import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const props = {
  enhance: z.boolean()
    .describe(JSON.stringify({
      text: 'Uses AI to analyze an image and make adjustments to enhance the appeal of the image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_enhance'
    }))
    .optional(),
};

export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { enhance = false } = options;

  if ( enhance ) {
    cldAsset.effect('e_enhance');
  }

  return {};
}