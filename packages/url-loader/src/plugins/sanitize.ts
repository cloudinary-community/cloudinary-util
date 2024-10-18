import { plugin } from "../lib/plugin.js";

export declare namespace SanitizePlugin {
  export interface Options {
    /**
     * @description Runs a sanitizer on SVG images.
     * @url https://cloudinary.com/documentation/transformation_reference#fl_sanitize
     */
    sanitize?: boolean;
  }
}

export const SanitizePlugin = plugin({
  name: "Sanitize",
  supports: "image",
  inferOwnOptions: {} as SanitizePlugin.Options,
  apply: (cldAsset, options) => {
    const { sanitize = true } = options;

    const shouldApplySanitizer: boolean =
      sanitize &&
      (options.format === "svg" ||
        (cldAsset as {} as { publicID: string }).publicID.endsWith(".svg"));

    if (shouldApplySanitizer) {
      cldAsset.addTransformation("fl_sanitize");
    }

    return {};
  },
});
