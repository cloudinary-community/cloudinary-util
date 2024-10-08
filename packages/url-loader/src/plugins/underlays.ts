import { objectHasKey } from "@cloudinary-util/util";
import type {
  CropMode,
  Height,
  ListableFlags,
  PositionOptions,
  Width,
} from "../constants/parameters.js";
import {
  position as qualifiersPosition,
  primary as qualifiersPrimary,
} from "../constants/qualifiers.js";
import { plugin } from "../lib/plugin.js";

export declare namespace Underlays {
  export interface Options {
    /**
     * @description Public ID of image that is applied under the base image.
     * @url https://cloudinary.com/documentation/transformation_reference#l_layer
     */
    underlay?: string;
    /**
     * @description Image layers that are applied under the base image.
     * @url https://cloudinary.com/documentation/transformation_reference#l_layer
     */
    underlays?: readonly NestedOptions[];
  }

  export interface NestedOptions {
    appliedEffects?: readonly object[];
    appliedFlags?: ListableFlags;
    effects?: readonly object[];
    crop?: CropMode;
    flags?: ListableFlags;
    height?: Height;
    position?: PositionOptions;
    publicId?: string;
    type?: string;
    url?: string;
    width?: Width;
  }
}

export const Underlays = plugin({
  assetTypes: ["image", "images", "video", "videos"],
  apply: (cldAsset, options) => {
    const { underlay, underlays = [] } = options;

    const typeQualifier = "u";

    if (Array.isArray(underlays)) {
      underlays.forEach(applyUnderlay);
    }

    if (typeof underlay === "string") {
      const underlayOptions: Underlays.NestedOptions = {
        publicId: underlay,
        crop: "fill",
        width: "1.0",
        height: "1.0",
        flags: ["relative"],
      };

      applyUnderlay(underlayOptions);
    }

    /**
     * applyUnderlay
     */

    function applyUnderlay({
      publicId,
      type,
      position,
      effects: layerEffects = [],
      flags: layerFlags = [],
      appliedFlags = [],
      ...options
    }: Underlays.NestedOptions) {
      const hasPublicId = typeof publicId === "string";
      const hasPosition = typeof position === "object";

      if (!hasPublicId) {
        console.warn(`An ${type} is missing a Public ID`);
        return;
      }

      // Start to construct the transformation string using the public ID

      let layerTransformation = `${typeQualifier}_${publicId.replace(
        /\//g,
        ":"
      )}`;

      // Begin organizing transformations based on what it is and the location
      // it needs to be placed in the URL

      const primary: Array<string> = [];
      const applied: Array<string> = [];

      // Gemeral options

      (Object.keys(options) as Array<keyof typeof options>).forEach((key) => {
        if (!objectHasKey(qualifiersPrimary, key)) return;
        const { qualifier } = qualifiersPrimary[key];
        primary.push(`${qualifier}_${options[key]}`);
      });

      // Layer effects

      layerEffects.forEach((effect) => {
        (Object.keys(effect) as Array<keyof typeof effect>).forEach((key) => {
          if (!objectHasKey(qualifiersPrimary, key)) return;
          const { qualifier } = qualifiersPrimary[key];
          primary.push(`${qualifier}_${effect[key]}`);
        });
      });

      // Positioning

      if (hasPosition) {
        (Object.keys(position) as Array<keyof typeof position>).forEach(
          (key) => {
            if (!objectHasKey(qualifiersPosition, key)) return;
            const { qualifier } = qualifiersPosition[key as string];
            applied.push(`${qualifier}_${position[key]}`);
          }
        );
      }

      // Layer Flags
      // Add flags to the primary layer transformation segment
      // @TODO: accept flag value

      const activeLayerFlags = Array.isArray(layerFlags)
        ? layerFlags
        : [layerFlags];

      activeLayerFlags.forEach((flag) => {
        const { success } = flagsEnum.safeParse(flag);

        if (!success) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`Invalid flag ${flag}, not applying.`);
          }
          return;
        }

        primary.push(`fl_${flag}`);
      });

      // Applied Flags
      // Add flags to the fl_layer_apply transformation segment
      // @TODO: accept flag value

      const activeAppliedFlags = Array.isArray(appliedFlags)
        ? appliedFlags
        : [appliedFlags];

      activeAppliedFlags.forEach((flag) => {
        const { success } = flagsEnum.safeParse(flag);

        if (!success) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`Invalid flag ${flag}, not applying.`);
          }
          return;
        }

        applied.push(`fl_${flag}`);
      });

      // Add all primary transformations

      layerTransformation = `${layerTransformation},${primary.join(",")}`;

      // Add all applied transformations

      layerTransformation = `${layerTransformation}/fl_layer_apply,fl_no_overflow`;

      if (applied.length > 0) {
        layerTransformation = `${layerTransformation},${applied.join(",")}`;
      }

      // Finally add it to the image

      cldAsset.addTransformation(layerTransformation);
    }

    return {};
  },
});
