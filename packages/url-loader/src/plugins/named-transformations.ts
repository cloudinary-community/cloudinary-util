import { z } from 'zod';

import { PluginSettings } from '../types/plugins';

const NamedTransformationSchema = z.string();
type NamedTransformation = z.infer<typeof NamedTransformationSchema>;

export const pluginProps = {
  namedTransformations: z.union([
      NamedTransformationSchema,
      z.array(NamedTransformationSchema)
    ])
    .describe(JSON.stringify({
      text: 'Named transformations to apply to asset.',
      url: 'https://cloudinary.com/documentation/image_transformations#named_transformations'
    }))
    .optional(),
  /**
   * @deprecated use {@link `namedTransformations`} instead
   */
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
  const { transformations, namedTransformations } = options;

  if ( transformations && process.env.NODE_ENVIRONMENT === 'development' ) {
    console.warn('The transformations prop will be deprecated in future versions. Please use namedTransformations');
  }

  let _namedTransformations = namedTransformations || transformations || [];

  if ( !Array.isArray(_namedTransformations) ) {
    _namedTransformations = [_namedTransformations];
  }

  _namedTransformations.forEach((transformation: NamedTransformation) => {
    cldAsset.addTransformation(`t_${transformation}`);
  });

  return {};
}