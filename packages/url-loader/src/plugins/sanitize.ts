import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const props = ['sanitize'];
export const assetTypes = ['image', 'images'];

export function plugin(props: PluginSettings<ImageOptions>) {
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
