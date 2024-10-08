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
  assetTypes: ["image", "images"],
  apply: (cldAsset, options) => {
    const { removeBackground = false } = options;
    if (removeBackground) {
      cldAsset.effect("e_background_removal");
    }
    return {};
  },
});
