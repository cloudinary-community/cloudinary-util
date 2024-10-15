import type {
  ExtractMode,
  ListablePrompts,
  Multiple,
} from "../constants/parameters.js";
import { plugin } from "../lib/plugin.js";
import { isArray } from "../lib/utils.js";

export declare namespace ExtractPlugin {
  export interface Options {
    /**
     * @description Extracts an area or multiple areas of an image, described in natural language.
     * @url https://cloudinary.com/documentation/transformation_reference#e_extract
     */
    extract?: ListablePrompts | NestedOptions;
  }

  export interface NestedOptions {
    prompt?: ListablePrompts;
    invert?: boolean;
    mode?: ExtractMode;
    multiple?: Multiple;
  }
}

export const ExtractPlugin = plugin({
  name: "Extract",
  supports: "image",
  applyWhen: "extract",
  apply: (cldAsset, { extract }) => {
    const properties = [];

    if (typeof extract === "string") {
      properties.push(`prompt_${extract}`);
    } else if (isArray(extract)) {
      properties.push(`prompt_${formatPrompts(extract)}`);
    } else {
      const prompt = formatPrompts(extract.prompt);

      if (prompt) {
        properties.push(`prompt_${prompt}`);
      }

      if (extract.invert === true) {
        properties.push("invert_true");
      }

      if (typeof extract.mode === "string") {
        properties.push(`mode_${extract.mode}`);
      }

      if (extract.multiple === true) {
        properties.push("multiple_true");
      }
    }

    if (properties.length > 0) {
      const transformation = `e_extract:${properties.join(";")}`;
      cldAsset.addTransformation(transformation);
    }

    return {};
  },
});

/**
 * formatPrompts
 */

function formatPrompts(prompts: ListablePrompts | undefined) {
  if (typeof prompts === "string") return prompts;

  if (isArray(prompts)) {
    return `(${prompts.filter((prompt) => typeof prompt === "string").join(";")})`;
  }

  return undefined;
}
