import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const props = ['restore'];
export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { restore = false } = options;

  if ( restore ) {
    cldAsset.effect('e_gen_restore');
  }

  return {};
}