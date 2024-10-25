import { getTransformations } from "@cloudinary-util/util";
import { plugin } from "../lib/plugin.js";

export declare namespace PreserveTransformationsPlugin {
  export interface Options {
    /**
     * @description Preserves transformations from a Cloudinary URL when using using a Cloudinary URL as the asset source (src).
     */
    preserveTransformations?: boolean;
  }
}

export const PreserveTransformationsPlugin = plugin({
  name: "PreserveTransformations",
  supports: "all",
  inferOwnOptions: {} as PreserveTransformationsPlugin.Options,
  props: {
    preserveTransformations: true,
  },
  apply: (cldAsset, options) => {
    const { preserveTransformations = false } = options;

    // Try to preserve the original transformations from the Cloudinary URL passed in
    // to the function. This only works if the URL has a version number on it and otherwise
    // will fail to load

    if (preserveTransformations) {
      try {
        if (options.src === undefined) {
          throw new Error("options.src was undefined");
        }
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
});
