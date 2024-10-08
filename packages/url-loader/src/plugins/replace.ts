import { isArray } from "@cloudinary-util/util";
import { plugin } from "../lib/plugin.js";

export declare namespace ReplacePlugin {
  export interface Options {
    /**
     * @description Uses generative AI to replace parts of your image with something else.
     * @url https://cloudinary.com/documentation/transformation_reference#e_gen_replace
     */
    replace?: NestedOptions | ReadonlyArray<string> | ReadonlyArray<boolean>;
  }

  export interface NestedOptions {
    from: string;
    to: string;
    preserveGeometry?: boolean;
  }
}

export const ReplacePlugin = plugin({
  supports: "image",
  apply: (cldAsset, options) => {
    const { replace = null } = options;

    if (replace) {
      let from: string,
        to: string,
        preserveGeometry: boolean = false;

      if (isArray(replace)) {
        from = replace[0] as string;
        to = replace[1] as string;
        preserveGeometry = (replace[2] as boolean) || false;
      } else {
        from = replace.from;
        to = replace.to;
        preserveGeometry = replace.preserveGeometry || false;
      }

      const properties = [`e_gen_replace:from_${from}`, `to_${to}`];

      // This property defaults to false, so we only need to pass it if it's true
      if (preserveGeometry) {
        properties.push(`preserve-geometry_${preserveGeometry}`);
      }

      cldAsset.addTransformation(properties.join(";"));
    }

    return {};
  },
});
