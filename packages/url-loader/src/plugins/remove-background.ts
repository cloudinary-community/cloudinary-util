import { PluginSettings } from '../types/plugins';

export const props = ['removeBackground'];
export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { removeBackground = false } = options;
  if ( removeBackground ) {
    cldAsset.effect('e_background_removal');
  }
  return {};
}