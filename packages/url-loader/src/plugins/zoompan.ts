import { z } from 'zod';

import { ImageOptions } from '../types/image';
import { PluginSettings, PluginOptions } from '../types/plugins';

export const props = {
  zoompan: z.union([
      z.string(),
      z.boolean(),
      z.object({
        loop: z.union([ z.string(), z.boolean() ]),
        options: z.string()
      })
    ])
    .describe(JSON.stringify({
      text: 'Applies zooming and/or panning to an image, resulting in a video or animated image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_zoompan'
    }))
    .optional()
};

export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { zoompan = false } = options;

  const overrides: PluginOptions = {
    format: undefined
  };

  if ( zoompan === true ) {
    cldAsset.effect('e_zoompan');
  } else if ( typeof zoompan === 'string' ) {
    if ( zoompan === 'loop' ) {
      cldAsset.effect('e_zoompan');
      cldAsset.effect('e_loop');
    } else {
      cldAsset.effect(`e_zoompan:${zoompan}`);
    }
  } else if ( typeof zoompan === 'object' ) {
    let zoompanEffect = 'e_zoompan';

    if ( typeof zoompan.options === 'string' ) {
      zoompanEffect = `${zoompanEffect}${zoompan.options}`;
    }

    cldAsset.effect(zoompanEffect);

    let loopEffect;

    if ( zoompan.loop === true ) {
      loopEffect = 'e_loop';
    } else if ( typeof zoompan.loop === 'string' ) {
      loopEffect = `e_loop${zoompan.loop}`;
    }

    if ( loopEffect ) {
      cldAsset.effect(loopEffect);
    }
  }

  if ( zoompan !== false ) {
    overrides.format = 'auto:animated';
  }

  return {
    options: overrides
  }
}