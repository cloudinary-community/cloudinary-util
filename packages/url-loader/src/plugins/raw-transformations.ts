import type { TransformationPlugin } from "../types/plugins.js";

export declare namespace RawTransformations {
  export interface Options {
    /**
     * @description Array of transformation parameters using the Cloudinary URL API to apply to an asset.
     * @url https://cloudinary.com/documentation/transformation_reference
     */
    rawTransformations?: string | readonly string[];
  }
}

export const RawTransformations = {
  assetTypes: ["image", "images", "video", "videos"],
  apply: ({ cldAsset, options }) => {
    let { rawTransformations = [] } = options;

    if (!Array.isArray(rawTransformations)) {
      rawTransformations = [rawTransformations];
    }

    rawTransformations.forEach((transformation: RawTransformations.Options) => {
      cldAsset.addTransformation(transformation);
    });

    return {};
  },
} satisfies TransformationPlugin;
