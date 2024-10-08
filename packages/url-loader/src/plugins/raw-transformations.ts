import { isArray } from "@cloudinary-util/util";
import { plugin } from "../lib/plugin.js";

export declare namespace RawTransformationsPlugin {
  export interface Options {
    /**
     * @description Array of transformation parameters using the Cloudinary URL API to apply to an asset.
     * @url https://cloudinary.com/documentation/transformation_reference
     */
    rawTransformations?: string | readonly string[];
  }
}

export const RawTransformationsPlugin = plugin({
  assetTypes: ["image", "images", "video", "videos"],
  apply: (cldAsset, options) => {
    let { rawTransformations = [] } = options;

    if (!isArray(rawTransformations)) {
      rawTransformations = [rawTransformations];
    }

    rawTransformations.forEach(
      (transformation: RawTransformationsPlugin.Options) => {
        cldAsset.addTransformation(transformation);
      }
    );

    return {};
  },
});
