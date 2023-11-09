import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

import { getFormat } from '@cloudinary-util/util';

export const props = ['default'];
export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { defaultImage } = options;
  if ( typeof defaultImage === 'string' ) {
    if ( !getFormat(defaultImage) ) {
      console.warn(`The defaultImage prop may be missing a format and must include it along with the public ID.`);
    }
    const defaultImageId = defaultImage.replace(/\//g, ':');
    cldAsset.addTransformation(`d_${defaultImageId}`);
  }

  return {};
}