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

export const EnhancePlugin = plugin({
  supports: "image",
  apply: (cldAsset, options) => {
    if (options.enhance) {
      cldAsset.addTransformation("e_enhance");
    }

    return {};
  },
});
