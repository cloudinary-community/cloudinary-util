import { PluginSettings } from '../types/plugins';

export const props = ['sanitize'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { sanitize = true } = options;

  const shouldApplySanitizer: boolean =
    sanitize &&
    (options.format === 'svg' || cldAsset.publicID.endsWith('.svg'));

  if (shouldApplySanitizer) {
    cldAsset.effect('fl_sanitize');
  }

  return {};
}
