import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const props = ['removeBackground'];
export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { removeBackground = false } = options;
  if ( removeBackground ) {
    cldAsset.effect('e_background_removal');
  }
  return {};
}