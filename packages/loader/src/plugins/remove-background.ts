import { PluginSettings } from '../types/plugins';

export const props = ['removeBackground'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { removeBackground = false } = options;
  if ( removeBackground ) {
    cldImage.effect('e_background_removal');
  }
}