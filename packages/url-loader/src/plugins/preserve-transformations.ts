import { getTransformations } from "@cloudinary-util/util";
import type { TransformationPlugin } from "../types/plugins.js";

export declare namespace PreserveTransformations {
  export interface Options {
    /**
     * @description Preserves transformations from a Cloudinary URL when using using a Cloudinary URL as the asset source (src).
     */
    preserveTransformations?: boolean;
  }
}

export const PreserveTransformations = {
  assetTypes: ["image", "images", "video", "videos"],
  apply: ({ cldAsset, options }) => {
    const { preserveTransformations = false } = options;

    // Try to preserve the original transformations from the Cloudinary URL passed in
    // to the function. This only works if the URL has a version number on it and otherwise
    // will fail to load

    if (preserveTransformations) {
      try {
        const transformations = getTransformations(options.src).map((t) =>
          t.join(",")
        );
        transformations.flat().forEach((transformation) => {
          cldAsset.addTransformation(transformation);
        });
      } catch (e) {
        console.warn(
          `Failed to preserve transformations: ${(e as Error).message}`
        );
      }
    }

    return {};
  },
} satisfies TransformationPlugin;
