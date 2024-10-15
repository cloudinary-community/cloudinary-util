import type { ListablePrompts } from "../constants/parameters.js";
import { plugin } from "../lib/plugin.js";
import { promptArrayToString } from "../lib/transformations.js";
import { isArray } from "../lib/utils.js";

export declare namespace RemovePlugin {
  export interface Options {
    /**
     * @description Applies zooming and/or panning to an image, resulting in a video or animated image.
     * @url https://cloudinary.com/documentation/transformation_reference#e_zoompan
     */
    remove?: ListablePrompts | NestedOptions;
  }

  export interface NestedOptions {
    prompt?: ListablePrompts;
    region?: number[] | number[][];
    multiple?: boolean;
    removeShadow?: boolean;
  }
}

export const RemovePlugin = plugin({
  name: "Remove",
  supports: "image",
  inferOwnOptions: {} as RemovePlugin.Options,
  apply: (cldAsset, options) => {
    const { remove } = options;

    const removeOptions: Record<string, string | undefined> = {
      prompt: undefined,
      region: undefined,
      multiple: undefined,
      "remove-shadow": undefined,
    };

    if (typeof remove === "string") {
      removeOptions.prompt = remove;
    } else if (isArray(remove)) {
      removeOptions.prompt = promptArrayToString(remove);
    } else if (typeof remove === "object") {
      const hasPrompt =
        typeof remove.prompt === "string" || isArray(remove.prompt);
      const hasRegion = isArray(remove.region);

      if (hasPrompt && hasRegion) {
        throw new Error(
          "Invalid remove options: you can not have both a prompt and a region. More info: https://cloudinary.com/documentation/transformation_reference#e_gen_remove"
        );
      }

      // Allow the prompt to still be available as either a string or an array

      if (typeof remove.prompt === "string") {
        removeOptions.prompt = remove.prompt;
      } else if (isArray(remove.prompt)) {
        removeOptions.prompt = promptArrayToString(remove.prompt);
      }

      // Region can be an array of numbers, or an array with 1+ arrays of numbers

      if (isArray(remove.region)) {
        removeOptions.region = regionArrayToString(remove.region);
      }

      if (remove.multiple === true) {
        removeOptions.multiple = `true`;
      }

      if (remove.removeShadow === true) {
        removeOptions["remove-shadow"] = `true`;
      }
    }

    const transformation = Object.entries(removeOptions)
      .filter(([, value]) => !!value)
      .map(([key, value]) => `${key}_${value}`)
      .join(";");

    if (transformation) {
      cldAsset.addTransformation(`e_gen_remove:${transformation}`);
    }

    return {};
  },
});

/**
 * regionArrayToString
 */

function regionArrayToString(
  regionArray: Array<number | Array<number>>
): string {
  const indexes: Record<number, string> = {
    0: "x",
    1: "y",
    2: "w",
    3: "h",
  };

  const regionString = regionArray
    .map((region, index) => {
      if (isArray(region)) {
        return regionArrayToString(region);
      }

      const key = indexes[index];

      return `${key}_${region}`;
    })
    .join(";");

  return `(${regionString})`;
}
