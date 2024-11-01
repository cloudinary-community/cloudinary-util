import { plugin } from "../lib/plugin.js";

export declare namespace VersionPlugin {
  export interface Options {
    /**
     * @description Custom version number to apply to asset URL.
     * @url https://cloudinary.com/documentation/advanced_url_delivery_options#asset_versions
     */
    version?: number | string;
  }
}

export const VersionPlugin = /* #__PURE__ */ plugin({
  name: "Version",
  supports: "all",
  inferOwnOptions: {} as VersionPlugin.Options,
  props: {
    version: true,
  },
  apply: (cldAsset, opts) => {
    const { version } = opts;

    if (typeof version !== "string" && typeof version !== "number") return {};

    // Replace a `v` in the string just in case the caller
    // passes it in
    cldAsset.setVersion(`${version}`.replace("v", ""));

    return {};
  },
});
