import type { ImageOptions } from "../types/image.js";
import type { TransformationPlugin } from "../types/plugins.js";

export declare namespace Sanitize {
  export interface Options {
    /**
     * @description Runs a sanitizer on SVG images.
     * @url https://cloudinary.com/documentation/transformation_reference#fl_sanitize
     */
    sanitize?: boolean;
  }
}

export const Sanitize = {
  assetTypes: ["image", "images"],
  plugin: ({ cldAsset, options }) => {
    const { sanitize = true } = options;

    const shouldApplySanitizer: boolean =
      sanitize &&
      (options.format === "svg" || cldAsset.publicID.endsWith(".svg"));

    if (shouldApplySanitizer) {
      cldAsset.effect("fl_sanitize");
    }

    return {};
  },
} satisfies TransformationPlugin<ImageOptions>;
