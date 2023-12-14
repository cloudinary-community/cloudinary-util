import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

// import { constructPluginSchema } from '../lib/plugins';

const pluginProps = [
  {
    name: 'fillBackground',
    type: z.boolean().optional(),
    assetTypes: ['image', 'images']
  }
];

// @todo
// const pluginPropsSchema = constructPluginSchema(pluginProps);

export const props = pluginProps.map(({ name }) => name);
export const assetTypes = Array.from(new Set(pluginProps.flatMap(({ assetTypes }) => assetTypes)));

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