import { PluginSettings } from '../types/plugins';

export const props = [
  'seoSuffix'
];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { seoSuffix } = options;

  if ( typeof seoSuffix === 'string' ) {
    if ( options.deliveryType === 'fetch' ) {
      console.warn('SEO suffix is not supported with a delivery type of fetch')
    } else {
      cldImage.setSuffix(seoSuffix);
    }
  }

  return {};
}
