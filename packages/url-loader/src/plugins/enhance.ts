import { plugin } from "../lib/plugin.js";

export declare namespace Enhance {
  export interface Options {
    /**
     * @description Uses AI to analyze an image and make adjustments to enhance the appeal of the image.
     * @url https://cloudinary.com/documentation/transformation_reference#e_enhance
     */
    enhance?: boolean;
  }
}

export const Enhance = plugin({
  assetTypes: ["image", "images"],
  props: {},
  apply: (cldAsset, options) => {
    const { enhance = false } = options;

    if (enhance) {
      cldAsset.effect("e_enhance");
    }

    return {};
  },
});
