import { objectHasKey } from '@cloudinary-util/util';

import { PluginSettings } from '../types/plugins';

import { video as qualifiersVideo } from '../constants/qualifiers';
import { constructTransformation } from '../lib/transformations';

export const props = [...Object.keys(qualifiersVideo), 'effects'];
export const assetTypes = ['video', 'videos'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;

  (Object.keys(options) as Array<keyof typeof options>).forEach(key => {
    if ( !objectHasKey(qualifiersVideo, key) ) return;

    const { prefix, qualifier, converters } = qualifiersVideo[key];

    const transformation = constructTransformation({
      prefix,
      qualifier,
      value: options[key],
      converters
    });

    cldAsset.addTransformation(transformation);
  });

  return {};
}