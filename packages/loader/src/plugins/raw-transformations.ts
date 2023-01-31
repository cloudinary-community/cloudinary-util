import { PluginSettings } from '../types/plugins';

export const props = ['rawTransformations'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { rawTransformations = [] } = options;

  rawTransformations.forEach(transformation => {
    cldImage.addTransformation(transformation);
  });
}