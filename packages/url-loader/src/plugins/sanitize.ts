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

export const SanitizePlugin = /* #__PURE__ */ plugin({
  name: "Sanitize",
  supports: "image",
  inferOwnOptions: {} as SanitizePlugin.Options,
  props: {
    sanitize: true,
  },
  alwaysApply: true,
  apply: (cldAsset, opts, ctx) => {
    const { sanitize = true } = opts;

    const shouldApplySanitizer: boolean =
      sanitize &&
      (ctx.format === "svg" ||
        (cldAsset as {} as { publicID: string }).publicID.endsWith(".svg"));

    if (shouldApplySanitizer) {
      cldAsset.addTransformation("fl_sanitize");
    }

    return {};
  },
});
