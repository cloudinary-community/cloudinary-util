import { PluginSettings } from '../types/plugins';

export const props = ['version'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { version } = options;

  if ( typeof version === 'string' || typeof version === 'number' ) {
    // Replace a `v` in the string just in case the caller
    // passes it in
    cldImage.setVersion(`${version}`.replace('v', ''));
  }

  return {};
}