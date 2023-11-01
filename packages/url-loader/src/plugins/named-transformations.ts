import { PluginSettings } from '../types/plugins';

export const props = ['transformations'];
export const assetTypes = ['image', 'images', 'video', 'videos'];
export const strict = true;

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  let { transformations = [] } = options;

  if ( !Array.isArray(transformations) ) {
    transformations = [transformations];
  }

  transformations.forEach(transformation => {
    cldAsset.addTransformation(`t_${transformation}`);
  });

  return {};
}