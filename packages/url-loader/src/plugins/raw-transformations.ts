import { PluginSettings } from '../types/plugins';

export const props = ['rawTransformations'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { rawTransformations = [] } = options;

  rawTransformations.forEach(transformation => {
    cldAsset.addTransformation(transformation);
  });

  return {};
}