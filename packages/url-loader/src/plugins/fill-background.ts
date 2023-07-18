import { ImageOptions } from '../types/image';
import { PluginSettings } from '../types/plugins';

export const props = ['fillBackground'];
export const assetTypes = ['image', 'images'];

const defaultCrop = 'pad';

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { fillBackground } = options as ImageOptions; // why do i need to cast it here?;

  if ( fillBackground === true ) {
    const properties = [
      'b_gen_fill',
      `ar_${options.width}:${options.height}`,
      `w_${options.width}`,
      `c_${defaultCrop}`
    ]

    cldAsset.addTransformation(properties.join(','));
  } else if ( typeof fillBackground === 'object' ) {
    const { crop = defaultCrop, gravity, prompt } = fillBackground

    const properties = [
      `ar_${options.width}:${options.height}`,
      `w_${options.width}`,
      `c_${crop}`
    ]

    if ( typeof prompt === 'string' ) {
      properties.unshift(`b_gen_fill:${prompt}`);
    } else {
      properties.unshift(`b_gen_fill`);
    }

    if ( typeof gravity === 'string' ) {
      properties.push(`g_${gravity}`);
    }

    cldAsset.addTransformation(properties.join(','));
  }

  return {};
}