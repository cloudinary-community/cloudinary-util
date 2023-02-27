import { PluginSettings } from '../types/plugins';

export const props = ['sanitize'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { sanitize = true } = options;

  const shouldApplySanitizer: boolean =
    sanitize &&
    (options.format === 'svg' || cldImage.publicID.endsWith('.svg'));

  if (shouldApplySanitizer) {
    cldImage.effect('fl_sanitize');
  }

  return {};
}
