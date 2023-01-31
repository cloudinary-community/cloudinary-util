import { PluginSettings } from '../types/plugins';

import { effects as qualifiersEffects } from '../constants/qualifiers';
import { constructTransformation } from '../lib/transformations';

export const props = [...Object.keys(qualifiersEffects), 'effects'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;

  // Handle any top-level effect props

  const transformationStrings = constructTransformationString({
    effects: qualifiersEffects,
    options
  })

  transformationStrings.filter(t => !!t).forEach(transformation => cldImage.effect(transformation));;

  // If we're passing in an effects prop explicitly, treat it as an array of
  // effects that we need to process

  if ( Array.isArray(options?.effects) ) {
    options?.effects.forEach(effectsSet => {
      const transformationString = constructTransformationString({
        effects: qualifiersEffects,
        options: effectsSet
      }).filter(t => !!t).join(',');
      cldImage.effect(transformationString);
    });
  }

  interface ConstructTransformationStringSettings {
    effects: object;
    options?: object;
  }

  function constructTransformationString({ effects, options }: ConstructTransformationStringSettings) {
    return (Object.keys(effects) as Array<keyof typeof effects>).map(key => {
      const { prefix, qualifier } = effects[key];
      return constructTransformation({
        qualifier,
        prefix,
        value: options?.[key]
      });
    })
  }
}