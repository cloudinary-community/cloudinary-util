import { plugin } from "../lib/plugin.js";
import { isArray } from "../lib/utils.js";

export declare namespace NamedTransformationsPlugin {
  export interface Options {
    /**
     * @description Named transformations to apply to asset.
     * @url https://cloudinary.com/documentation/image_transformations#named_transformations
     */
    namedTransformations?: string | ReadonlyArray<string>;
    /**
     * @deprecated use {@link `namedTransformations`} instead
     * @description: Deprecated: use namedTransformations instead
     * @url https://cloudinary.com/documentation/image_transformations#named_transformations
     */
    transformations?: string | ReadonlyArray<string>;
  }
}

export const NamedTransformationsPlugin = plugin({
  name: "NamedTransformations",
  strict: true,
  supports: "all",
  apply: (cldAsset, options) => {
    const { transformations, namedTransformations } = options;

    if (transformations && process.env.NODE_ENVIRONMENT === "development") {
      console.warn(
        "The transformations prop is deprecated. Please use namedTransformations instead."
      );
    }

    let _namedTransformations = namedTransformations || transformations || [];

    if (!isArray(_namedTransformations)) {
      _namedTransformations = [_namedTransformations];
    }

    _namedTransformations.forEach((transformation: string) => {
      cldAsset.addTransformation(`t_${transformation}`);
    });

    return {};
  },
});
