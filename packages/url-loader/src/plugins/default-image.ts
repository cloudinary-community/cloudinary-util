import { getFormat } from "@cloudinary-util/util";
import { plugin } from "../lib/plugin.js";

export declare namespace DefaultImagePlugin {
  export interface Options {
    /**
     * @description Configures the default image to use in case the given public ID is not available. Must include file extension.
     * @url https://cloudinary.com/documentation/transformation_reference#d_default_image
     */
    defaultImage?: string;
  }
}

export const DefaultImagePlugin = plugin({
  name: "DefaultImage",
  supports: "image",
  inferOwnOptions: {} as DefaultImagePlugin.Options,
  apply: (asset, opts) => {
    const { defaultImage } = opts;

    if (typeof defaultImage === "string") {
      if (!getFormat(defaultImage)) {
        console.warn(
          `The defaultImage prop may be missing a format and must include it along with the public ID. (Ex: myimage.jpg)`
        );
      }
      const defaultImageId = defaultImage.replace(/\//g, ":");
      asset.addTransformation(`d_${defaultImageId}`);
    }

    return {};
  },
});
