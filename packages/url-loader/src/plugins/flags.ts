import { isArray } from "@cloudinary-util/util";
import type { ListableFlags } from "../constants/parameters.js";
import { plugin } from "../lib/plugin.js";

export declare namespace FlagsPlugin {
  export interface Options {
    flags?: ListableFlags;
  }
}

export const FlagsPlugin = plugin({
  name: "Flags",
  supports: "all",
  applyWhen: "flags",
  apply: (cldAsset, { flags }) => {
    // First iteration of adding flags follows the same pattern
    // as the top level option from Cloudinary URL Gen SDK where
    // each flag is individually added as its own segment via
    // the addFlag method. Flags can have additional context and
    // may warrant case-by-case applications

    if (isArray(flags)) {
      flags.forEach(cldAsset.addFlag);
    } else if (typeof flags === "object") {
      Object.entries(flags).forEach(([qualifier, value]) => {
        // The addFlag method encodes some characters, specifically
        // the "." character which breaks some use cases like
        // du_2.5
        cldAsset.addTransformation(`fl_${qualifier}:${value}`);
      });
    }

    return {};
  },
});
