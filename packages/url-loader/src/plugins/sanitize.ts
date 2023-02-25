import { PluginSettings } from '../types/plugins';

export const props = ['sanitize'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { sanitize = false } = options;
  if ( sanitize ) {
    cldImage.effect('fl_sanitize');
  }
  return {};
}
