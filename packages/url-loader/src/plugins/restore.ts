import { plugin } from "../lib/plugin.js";

export declare namespace RestorePlugin {
  export interface Options {
    /**
     * @description Uses generative AI to restore details in poor quality images or images that may have become degraded through repeated processing and compression.
     * @url https://cloudinary.com/documentation/transformation_reference#e_gen_restore
     */
    restore?: boolean;
  }
}

export const RestorePlugin = /* #__PURE__ */ plugin({
  name: "Restore",
  supports: "image",
  inferOwnOptions: {} as RestorePlugin.Options,
  props: {
    restore: true,
  },
  apply: (cldAsset, opts) => {
    const { restore } = opts;

    if (restore) {
      cldAsset.addTransformation("e_gen_restore");
    }

    return {};
  },
});
