import { getTransformations } from "@cloudinary-util/util";
import { z } from "zod";
import type { TransformationPlugin } from "../types/plugins.js";

export const preserveTransformationsProps = {
  preserveTransformations: z
    .boolean()
    .describe(
      JSON.stringify({
        text: "Array of transformation parameters using the Cloudinary URL API to apply to an asset.",
        url: "https://cloudinary.com/documentation/transformation_reference",
      })
    )
    .optional(),
};

export const preserveTransformationsPlugin = {
  props: preserveTransformationsProps,
  assetTypes: ["image", "images", "video", "videos"],
  plugin: ({ cldAsset, options }) => {
    const { preserveTransformations = false } = options;

    // Try to preserve the original transformations from the Cloudinary URL passed in
    // to the component. This only works if the URL has a version number on it and otherwise
    // will fail to load

    if (preserveTransformations) {
      try {
        const transformations = getTransformations(options.src).map(t => t.join(','));
        transformations.flat().forEach((transformation) => {
          cldAsset.addTransformation(transformation);
        });
      } catch(e) {
        console.warn(`Failed to preserve transformations: ${(e as Error).message}`)
      }
    }

    return {};
  },
} satisfies TransformationPlugin;
