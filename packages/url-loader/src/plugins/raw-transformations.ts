import type { TransformationPlugin } from "../types/plugins.js";

export interface RawTransformationsOptions {
  /**
   * @description Array of transformation parameters using the Cloudinary URL API to apply to an asset.
   * @url https://cloudinary.com/documentation/transformation_reference
   */
  rawTransformations?: string | readonly string[];
}

export const rawTransformationsPlugin = {
  assetTypes: ["image", "images", "video", "videos"],
  plugin: ({ cldAsset, options }) => {
    let { rawTransformations = [] } = options;

    if (!Array.isArray(rawTransformations)) {
      rawTransformations = [rawTransformations];
    }

    rawTransformations.forEach((transformation: RawTransformationsOptions) => {
      cldAsset.addTransformation(transformation);
    });

    return {};
  },
} satisfies TransformationPlugin;
