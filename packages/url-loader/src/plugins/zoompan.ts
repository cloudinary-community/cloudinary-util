import { plugin } from "../lib/plugin.js";
import type { PluginOptions } from "../types/plugins.js";

export declare namespace ZoompanPlugin {
  export interface Options {
    /**
     * @description Applies zooming and/or panning to an image, resulting in a video or animated image.
     * @url https://cloudinary.com/documentation/transformation_reference#e_zoompan
     */
    zoompan?: string | boolean | NestedOptions;
  }

  export interface NestedOptions {
    loop?: Loop;
    options: string;
  }
}

export const ZoompanPlugin = plugin({
  assetTypes: ["image", "images"],
  apply: (cldAsset, options) => {
    const { zoompan = false } = options;

    const overrides: PluginOptions = {
      format: undefined,
    };

    if (zoompan === true) {
      cldAsset.effect("e_zoompan");
    } else if (typeof zoompan === "string") {
      if (zoompan === "loop") {
        cldAsset.effect("e_zoompan");
        cldAsset.effect("e_loop");
      } else {
        cldAsset.effect(`e_zoompan:${zoompan}`);
      }
    } else if (typeof zoompan === "object") {
      let zoompanEffect = "e_zoompan";

      if (typeof zoompan.options === "string") {
        zoompanEffect = `${zoompanEffect}:${zoompan.options}`;
      }

      cldAsset.effect(zoompanEffect);

      let loopEffect;

      if (zoompan.loop === true) {
        loopEffect = "e_loop";
      } else if (
        typeof zoompan.loop === "string" ||
        typeof zoompan.loop === "number"
      ) {
        loopEffect = `e_loop:${zoompan.loop}`;
      }

      if (loopEffect) {
        cldAsset.effect(loopEffect);
      }
    }

    if (zoompan !== false) {
      overrides.format = "auto:animated";
    }

    return {
      options: overrides,
    };
  },
});
