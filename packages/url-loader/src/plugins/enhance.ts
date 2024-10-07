import type { ImageOptions } from "../types/image.js";
import type { TransformationPlugin } from "../types/plugins.js";

export interface EnhanceOptions {
  /**
   * @description Uses AI to analyze an image and make adjustments to enhance the appeal of the image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_enhance
   */
  enhance?: boolean;
}

export const enhancePlugin = {
  assetTypes: ["image", "images"],
  plugin: (settings) => {
    const { cldAsset, options } = settings;
    const { enhance = false } = options;

    if (enhance) {
      cldAsset.effect("e_enhance");
    }

    return {};
  },
} satisfies TransformationPlugin<ImageOptions>;
