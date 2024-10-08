import { plugin } from "../lib/plugin.js";

export declare namespace RemoveBackgroundPlugin {
  export interface Options {
    /**
     * @description Removes the background of an image using the Cloudinary AI Background Removal Add-On (Required).
     * @url https://cloudinary.com/documentation/cloudinary_ai_background_removal_addon
     */
    removeBackground?: boolean;
  }
}

export const RemoveBackgroundPlugin = plugin({
  supports: "image",
  apply: (cldAsset, options) => {
    if (options.removeBackground) {
      cldAsset.addTransformation("e_background_removal");
    }
    return {};
  },
});
