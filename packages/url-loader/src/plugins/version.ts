import { z } from 'zod';

import { PluginSettings } from '../types/plugins';

export const props = {
  version: z.union([
      z.number(),
      z.string()
    ])
    .describe(JSON.stringify({
      text: 'Custom version number to apply to asset URL.',
      url: 'https://cloudinary.com/documentation/advanced_url_delivery_options#asset_versions'
    }))
    .optional()
};

export const assetTypes = ['image', 'images', 'video', 'videos'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { version } = options;

  if ( typeof version === 'string' || typeof version === 'number' ) {
    // Replace a `v` in the string just in case the caller
    // passes it in
    cldAsset.setVersion(`${version}`.replace('v', ''));
  }

  return {};
}