import { plugin } from "../lib/plugin.js";

export declare namespace EnhancePlugin {
  export interface Options {
    /**
     * @description Uses AI to analyze an image and make adjustments to enhance the appeal of the image.
     * @url https://cloudinary.com/documentation/transformation_reference#e_enhance
     */
    enhance?: boolean;
  }
}

export const EnhancePlugin = /* #__PURE__ */ plugin({
  name: "Enhance",
  supports: "image",
  inferOwnOptions: {} as EnhancePlugin.Options,
  props: {
    enhance: true,
  },
  apply: (cldAsset, opts) => {
    if (opts.enhance) {
      cldAsset.addTransformation("e_enhance");
    }

    return {};
  },
});
