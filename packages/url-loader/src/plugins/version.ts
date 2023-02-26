import { PluginSettings } from '../types/plugins';

export const props = ['version'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { version } = options;

  if ( typeof version === 'string' ) {
    cldImage.setVersion(version.replace('v', ''));
  }

  return {};
}