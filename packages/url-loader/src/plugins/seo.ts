import { PluginSettings } from '../types/plugins';

export const props = ['seoSuffix'];
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
