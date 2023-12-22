import { z } from 'zod';

import { PluginSettings } from '../types/plugins';

const NamedTransformationSchema = z.string();
type NamedTransformation = z.infer<typeof NamedTransformationSchema>;

export const pluginProps = {
  // @todo: deprecate in favor of namedTransformations
  transformations: z.union([
      NamedTransformationSchema,
      z.array(NamedTransformationSchema)
    ])
    .describe(JSON.stringify({
      text: 'Named transformations to apply to asset.',
      url: 'https://cloudinary.com/documentation/image_transformations#named_transformations'
    }))
    .optional(),
};

export const assetTypes = ['image', 'images', 'video', 'videos'];
export const strict = true;

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  let { transformations = [] } = options;

  if ( !Array.isArray(transformations) ) {
    transformations = [transformations];
  }

  transformations.forEach((transformation: NamedTransformation) => {
    cldAsset.addTransformation(`t_${transformation}`);
  });

  return {};
}