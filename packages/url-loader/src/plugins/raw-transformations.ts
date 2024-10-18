import { plugin } from "../lib/plugin.js";
import { isArray } from "../lib/utils.js";

export declare namespace RawTransformationsPlugin {
  export interface Options {
    /**
     * @description Array of transformation parameters using the Cloudinary URL API to apply to an asset.
     * @url https://cloudinary.com/documentation/transformation_reference
     */
    rawTransformations?: string | ReadonlyArray<string>;
  }
}

export const RawTransformationsPlugin = plugin({
  name: "RawTransformations",
  supports: "all",
  inferOwnOptions: {} as RawTransformationsPlugin.Options,
  apply: (cldAsset, options) => {
    let { rawTransformations = [] } = options;

    if (!isArray(rawTransformations)) {
      rawTransformations = [rawTransformations];
    }

    rawTransformations.forEach((transformation) => {
      cldAsset.addTransformation(transformation);
    });

    return {};
  },
});
