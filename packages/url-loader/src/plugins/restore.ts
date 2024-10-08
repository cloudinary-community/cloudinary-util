import { plugin } from "../lib/plugin.js";

export declare namespace Restore {
  export interface Options {
    /**
     * @description Uses generative AI to restore details in poor quality images or images that may have become degraded through repeated processing and compression.
     * @url https://cloudinary.com/documentation/transformation_reference#e_gen_restore
     */
    restore?: boolean;
  }
}

export const Restore = plugin({
  assetTypes: ["image", "images"],
  apply: (cldAsset, options) => {
    const { restore = false } = options;

    if (restore) {
      cldAsset.effect("e_gen_restore");
    }

    return {};
  },
});
