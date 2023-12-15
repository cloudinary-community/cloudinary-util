import { z } from 'zod';

import { PluginSettings } from '../types/plugins';

export const pluginProps = {
  seoSuffix: z.string()
    .describe(JSON.stringify({
      text: 'Configures the URL to include an SEO-friendly suffix in the URL',
      url: 'https://cloudinary.com/documentation/advanced_url_delivery_options#seo_friendly_media_asset_urls'
    }))
    .optional()
};

export const props = Object.entries(pluginProps).map(([name]) => name);
export const assetTypes = ['image', 'images', 'video', 'videos'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { seoSuffix } = options;

  if ( typeof seoSuffix === 'string' ) {
    if ( options.deliveryType === 'fetch' ) {
      console.warn('SEO suffix is not supported with a delivery type of fetch')
    } else {
      cldAsset.setSuffix(seoSuffix);
    }
  }

  return {};
}
