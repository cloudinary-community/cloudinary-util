import { PluginSettings } from '../types/plugins';

import { effects as qualifiersEffects } from '../constants/qualifiers';
import { constructTransformation } from '../lib/transformations';

export const props = [...Object.keys(qualifiersEffects), 'effects'];
export const assetTypes = ['image', 'images', 'video', 'videos'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;

  // Handle any top-level effect props

  const transformationStrings = constructTransformationString({
    effects: qualifiersEffects,
    options
  })

  transformationStrings.filter(t => !!t).forEach(transformation => cldAsset.effect(transformation));;

  // If we're passing in an effects prop explicitly, treat it as an array of
  // effects that we need to process

  if ( Array.isArray(options?.effects) ) {
    options?.effects.forEach(effectsSet => {
      const transformationString = constructTransformationString({
        effects: qualifiersEffects,
        options: effectsSet
      }).filter(t => !!t).join(',');
      cldAsset.effect(transformationString);
    });
  }

  interface ConstructTransformationStringSettings {
    effects: object;
    options?: object;
  }

  function constructTransformationString({ effects, options }: ConstructTransformationStringSettings) {
    return (Object.keys(effects) as Array<keyof typeof effects>).map(key => {
      const { prefix, qualifier, converters } = effects[key];
      return constructTransformation({
        qualifier,
        prefix,
        value: options?.[key],
        converters
      });
    })
  }

  return {};
}