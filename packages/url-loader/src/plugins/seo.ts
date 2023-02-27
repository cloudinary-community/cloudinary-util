import { PluginSettings } from '../types/plugins';

export const props = [
  'seoSuffix'
];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { seoSuffix } = options;

  if ( typeof seoSuffix === 'string' ) {
    cldImage.setSuffix(seoSuffix);
  }

  return {};
}
