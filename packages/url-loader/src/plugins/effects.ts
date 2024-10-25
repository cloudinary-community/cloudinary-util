import {
  effects as qualifiersEffects,
  type QualifierOptions,
} from "../constants/qualifiers.js";
import { plugin } from "../lib/plugin.js";
import { constructTransformation } from "../lib/transformations.js";
import { isArray } from "../lib/utils.js";

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
  inferOwnOptions: {} as EffectsPlugin.Options,
  props: {
    angle: true,
    art: true,
    autoBrightness: true,
    autoColor: true,
    autoContrast: true,
    assistColorblind: true,
    background: true,
    blackwhite: true,
    blur: true,
    blurFaces: true,
    blurRegion: true,
    border: true,
    brightness: true,
    brightnessHSB: true,
    cartoonify: true,
    color: true,
    colorize: true,
    contrast: true,
    displace: true,
    distort: true,
    fillLight: true,
    gamma: true,
    gradientFade: true,
    grayscale: true,
    hue: true,
    improve: true,
    loop: true,
    multiply: true,
    negate: true,
    noise: true,
    oilPaint: true,
    opacity: true,
    outline: true,
    pixelate: true,
    pixelateFaces: true,
    pixelateRegion: true,
    radius: true,
    redeye: true,
    replaceColor: true,
    saturation: true,
    screen: true,
    sepia: true,
    shadow: true,
    sharpen: true,
    shear: true,
    simulateColorblind: true,
    tint: true,
    trim: true,
    unsharpMask: true,
    vectorize: true,
    vibrance: true,
    vignette: true,
    effects: true,
  },
  apply: (cldAsset, opts) => {
    // Handle any top-level effect props

    const transformationStrings = constructTransformationString({
      effects: qualifiersEffects,
      options: opts,
    });

    transformationStrings.forEach((transformation) => {
      if (transformation) {
        cldAsset.addTransformation(transformation);
      }
    });

    // If we're passing in an effects prop explicitly, treat it as an array of
    // effects that we need to process

    if (isArray(opts?.effects)) {
      opts?.effects.forEach((effectsSet) => {
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
