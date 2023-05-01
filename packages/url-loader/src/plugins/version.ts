import { PluginSettings } from '../types/plugins';

export const props = ['version'];
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