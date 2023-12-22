import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

import { getFormat } from '@cloudinary-util/util';

export const pluginProps = {
  defaultImage: z.string()
    .describe(JSON.stringify({
      text: 'Configures the default image to use in case the given public ID is not available. Must include file extension.',
      url: 'https://cloudinary.com/documentation/transformation_reference#b_gen_fill'
    }))
    .optional(),
};

export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { defaultImage } = options;
  
  if ( typeof defaultImage === 'string' ) {
    if ( !getFormat(defaultImage) ) {
      console.warn(`The defaultImage prop may be missing a format and must include it along with the public ID. (Ex: myimage.jpg)`);
    }
    const defaultImageId = defaultImage.replace(/\//g, ':');
    cldAsset.addTransformation(`d_${defaultImageId}`);
  }

  return {};
}