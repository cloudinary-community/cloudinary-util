import { PluginSettings } from '../types/plugins';

export const props = ['transformations'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  let { transformations = [] } = options;

  if ( !Array.isArray(transformations) ) {
    transformations = [transformations];
  }

  transformations.forEach(transformation => {
    cldImage.addTransformation(`t_${transformation}`);
  });
}