import { normalizeNumberParameter } from "@cloudinary-util/util";
import type {
  AspectRatio,
  CropMode,
  Gravity,
  Height,
  Width,
  X,
  Y,
  Zoom,
} from "../constants/parameters.js";
import { plugin } from "../lib/plugin.js";
import { isArray } from "../lib/utils.js";
import type { PluginResults } from "../types/plugins.js";

const cropsAspectRatio = ["auto", "crop", "fill", "lfill", "fill_pad", "thumb"];
const cropsGravityAuto = ["auto", "crop", "fill", "lfill", "fill_pad", "thumb"];
const cropsWithZoom = ["crop", "thumb"];

const DEFAULT_CROP = "limit";

export declare namespace CroppingPlugin {
  export interface Options {
    aspectRatio?: AspectRatio;
    crop?: CropMode | NestedOptions | ReadonlyArray<NestedOptions>;
    gravity?: Gravity;
    zoom?: Zoom;
    /**
     * @description Height of the given asset.
     */
    height?: string | number;
    /**
     * @description Width of the given asset.
     */
    width?: string | number;
  }

  export interface NestedOptions {
    type: CropMode;
    aspectRatio?: AspectRatio;
    gravity?: Gravity;
    height?: Height;
    width?: Width;
    x?: X;
    y?: Y;
    zoom?: Zoom;
    source?: boolean;
  }
}

export const CroppingPlugin = /* #__PURE__ */ plugin({
  name: "Cropping",
  supports: "all",
  inferOwnOptions: {} as CroppingPlugin.Options,
  props: {
    aspectRatio: true,
    crop: true,
    gravity: true,
    zoom: true,
    height: true,
    width: true,
  },
  // crop is applied even if the crop key is undefined
  apply: (asset, opts) => {
    let crops: Array<CroppingPlugin.NestedOptions> = [];

    // Normalize the data that we're working with for simpler processing

    if (typeof opts.crop === "string" || typeof opts.crop === "undefined") {
      // If we have a type of string or we don't explicitly
      // have a crop set (default is limit) we're using the
      // default pattern of resizing/cropping after all
      // of the transformations

      crops.push({
        aspectRatio: opts.aspectRatio,
        height: opts.height,
        gravity: opts.gravity,
        type: opts.crop || DEFAULT_CROP,
        width: opts.width,
        zoom: opts.zoom,
      });
    } else if (typeof opts.crop === "object" && !isArray(opts.crop)) {
      crops.push(opts.crop);
    } else if (isArray(opts.crop)) {
      crops = [...opts.crop];
    }

    // We always need a post-transformation to resize the image, whether that uses the
    // default crop mode of "limit" or something user set, so if we dont have anything
    // matching that criteria, push on a "default" using whatever data we can find

    if (crops.length === 1 && crops[0].source === true) {
      crops.push({
        aspectRatio: opts.aspectRatio,
        width: opts.width,
        height: opts.height,
        gravity: opts.gravity,
        type: DEFAULT_CROP,
        zoom: opts.zoom,
      });
    }

    // Start working through the different crop options and determine whether they're
    // pre-transformation (source) or post-transformation (final)

    const finalTransformations: Array<Array<string>> = [];
    const sourceTransformations: Array<Array<string>> = [];

    for (const crop of crops) {
      const cropDimensions = {
        width: crop.width,
        height: crop.height,
      };

      if (
        typeof cropDimensions.width === "undefined" &&
        typeof crop.aspectRatio === "undefined"
      ) {
        cropDimensions.width = opts.width;

        // We likely don't want to infer one dimension and not the other
        // so only infer the height if we're already inferring the width

        if (typeof cropDimensions.height === "undefined") {
          cropDimensions.height = opts.height;
        }
      }

      const transformations = collectTransformations({
        aspectRatio: crop.aspectRatio,
        gravity: crop.gravity,
        type: crop.type || DEFAULT_CROP,
        x: crop.x,
        y: crop.y,
        zoom: crop.zoom,
        ...cropDimensions,
      });

      // A source of true means we want to apply the transformations
      // to the original source image

      if (transformations.length > 0) {
        if (crop.source === true) {
          sourceTransformations.push(transformations);
        } else {
          finalTransformations.push(transformations);
        }
      }
    }

    // This stage provides the option for someone to crop and resize the image before any transformations
    // are applied. this could be handy if you want a consistent size on different assets to share
    // transformations for instance

    sourceTransformations.forEach((transformation) => {
      if (transformation.length > 0) {
        asset.addTransformation(transformation.join(","));
      }
    });

    // If we have any overrides, which are the the standard width/height options, apply

    const results: PluginResults = {
      options: {},
    };

    if (results.options && finalTransformations.length > 0) {
      results.options.resize = finalTransformations
        .map((transformation) => transformation.join(","))
        .join("/");
    }

    return results;
  },
});

/**
 * CollectTransformations
 * @description Given the avialable crop options, returns an array of transformation strings
 */

function collectTransformations(collectOptions: CroppingPlugin.NestedOptions) {
  // Default the crop to "limit" to avoid upscaling
  // This avoid further distorting the image since the browser will resize in that case.
  // If caller wants actual resize, can explicitly pass in "scale".
  const { aspectRatio, type: crop, x, y, zoom } = collectOptions;

  // Normalize sizing parameters

  let gravity = collectOptions.gravity;
  const height = normalizeNumberParameter(collectOptions.height);
  const width = normalizeNumberParameter(collectOptions.width);

  const transformations = [];

  const hasDefinedDimensions = height || width;
  const hasValidAspectRatio = aspectRatio && cropsAspectRatio.includes(crop);
  const hasXCoordinate = typeof x === "number" || typeof x === "string";
  const hasYCoordinate = typeof y === "number" || typeof y === "string";
  const hasDefinedCoordinates = hasXCoordinate || hasYCoordinate;

  // Only apply a crop if we're defining some type of dimension attribute
  // where the crop would make sense

  if (
    crop &&
    (hasDefinedDimensions || hasValidAspectRatio || hasDefinedCoordinates)
  ) {
    transformations.push(`c_${crop}`);
  }

  // Aspect Ratio requires a crop mode to be applied so we want to make
  // sure a valid one is included

  if (hasValidAspectRatio) {
    transformations.push(`ar_${aspectRatio}`);
  }

  if (width) {
    transformations.push(`w_${width}`);
  }

  // Some crop types don't need a height and will resize based
  // on the aspect ratio

  if (!["limit"].includes(crop) && typeof height === "number") {
    transformations.push(`h_${height}`);
  }

  if (hasXCoordinate) {
    transformations.push(`x_${x}`);
  }

  if (hasYCoordinate) {
    transformations.push(`y_${y}`);
  }

  // Gravity of auto only applies to certain crop types otherewise
  // errors, so default to auto only when crop matches type.
  // If the user is providing x or y coordinates, we also don't want
  // to default to auto, as that will skew the intuitive results

  if (!gravity && cropsGravityAuto.includes(crop) && !hasDefinedCoordinates) {
    gravity = "auto";
  }

  // If we have gravity, apply it, but check that the gravity passed
  // in doesn't conflict with the crop mode

  if (gravity) {
    if (gravity === "auto" && !cropsGravityAuto.includes(crop)) {
      console.warn(
        `Auto gravity can only be used with crop modes: ${cropsGravityAuto.join(
          ", "
        )}. Not applying gravity.`
      );
    } else {
      transformations.push(`g_${gravity}`);
    }
  }

  // Some zoom types don't work with some crop types

  if (zoom) {
    if (zoom === "auto" && !cropsWithZoom.includes(crop)) {
      console.warn(
        `Zoom can only be used with crop modes: ${cropsWithZoom.join(
          ", "
        )}. Not applying zoom.`
      );
    } else {
      transformations.push(`z_${zoom}`);
    }
  }

  return transformations;
}
