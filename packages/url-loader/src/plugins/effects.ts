import {
  effects as qualifiersEffects,
  type QualifierOptions,
} from "../constants/qualifiers.js";
import { plugin } from "../lib/plugin.js";
import { constructTransformation } from "../lib/transformations.js";

export declare namespace EffectsPlugin {
  export interface NestableOptions extends QualifierOptions {}

  export interface Options extends NestableOptions {
    /**
     * @description Array of objects specifying transformations to be applied to asset.
     */
    effects?: ReadonlyArray<NestableOptions>;
  }
}

export const EffectsPlugin = plugin({
  name: "Effects",
  supports: "all",
  apply: (cldAsset, options) => {
    // Handle any top-level effect props

    const transformationStrings = constructTransformationString({
      effects: qualifiersEffects,
      options,
    });

    transformationStrings.forEach((transformation) => {
      if (transformation) {
        cldAsset.addTransformation(transformation);
      }
    });

    // If we're passing in an effects prop explicitly, treat it as an array of
    // effects that we need to process

    if (Array.isArray(options?.effects)) {
      options?.effects.forEach((effectsSet) => {
        const transformationString = constructTransformationString({
          effects: qualifiersEffects,
          options: effectsSet,
        })
          .filter((t) => !!t)
          .join(",");
        cldAsset.addTransformation(transformationString);
      });
    }

    interface ConstructTransformationStringSettings {
      effects: object;
      options?: object;
    }

    function constructTransformationString({
      effects,
      options,
    }: ConstructTransformationStringSettings) {
      return (Object.keys(effects) as Array<keyof typeof effects>).map(
        (key) => {
          const { prefix, qualifier, converters } = effects[key];
          return constructTransformation({
            qualifier,
            prefix,
            value: options?.[key],
            converters,
          });
        },
      );
    }

    return {};
  },
});
