import { z } from 'zod';

import { PluginSettings } from '../types/plugins';

const RawTransformationSchema = z.string();
type RawTransformation = z.infer<typeof RawTransformationSchema>;

export const pluginProps = {
  rawTransformations: z.union([
      RawTransformationSchema,
      z.array(RawTransformationSchema)
    ])
    .describe(JSON.stringify({
      text: 'Array of URL transformation parameters to apply to an asset.',
      url: 'https://cloudinary.com/documentation/transformation_reference'
    }))
    .optional(),
};

export const assetTypes = ['image', 'images', 'video', 'videos'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  let { rawTransformations = [] } = options;

  if ( !Array.isArray(rawTransformations) ) {
    rawTransformations = [rawTransformations];
  }

  rawTransformations.forEach((transformation: RawTransformation) => {
    cldAsset.addTransformation(transformation);
  });

  return {};
}