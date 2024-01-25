import * as parameters from '../constants/parameters';

import { PluginSettings, PluginResults } from '../types/plugins';

const cropsAspectRatio = [ 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsGravityAuto = [ 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsWithZoom = ['crop', 'thumb'];

const DEFAULT_CROP = 'limit';

export const props = {
  aspectRatio: parameters.aspectRatio.schema.optional(),
  baseCrop: parameters.baseCrop.schema.optional(),
  baseHeight: parameters.baseHeight.schema.optional(),
  baseWidth: parameters.baseWidth.schema.optional(),
  crop: parameters.crop.schema.default(DEFAULT_CROP).optional(),
  gravity: parameters.gravity.schema.optional(),
  zoom: parameters.zoom.schema.optional(),
};

export const assetTypes = ['image', 'images', 'video', 'videos'];

/**
 * normalizeNumberParameter
 * @TODO: move into util
 */

export function normalizeNumberParameter(param: number | string | undefined) {
  if ( typeof param !== 'string' ) return param;
  return parseInt(param)
}

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;

  const {
    aspectRatio,
    baseCrop: defaultBaseCrop,
    baseHeight: defaultBaseHeight,
    baseWidth: defaultBaseWidth,
    gravity: defaultGravity,
    width: defaultWidth,
    height: defaultHeight,
    // Default the crop to "limit" to avoid upscaling, even when widthResize is passed in.
    // This avoid further distorting the image since the browser will resize in that case.
    // If caller wants actual resize, can explicitly pass in "scale".
    crop = DEFAULT_CROP,
    zoom
  } = options;

  // Normalize sizing parameters

  let gravity = defaultGravity;
  let baseHeight = normalizeNumberParameter(defaultBaseHeight);
  let baseWidth = normalizeNumberParameter(defaultBaseWidth);
  let baseCrop = normalizeNumberParameter(defaultBaseCrop);
  let height = normalizeNumberParameter(defaultHeight);
  let width = normalizeNumberParameter(defaultWidth);

  const hasDefinedDimensions = height || width;
  const hasValidAspectRatio = aspectRatio && cropsAspectRatio.includes(crop);



  // Base Resizing/Cropping
  // This stage provides the option for someone to crop and resize the image before any transformations
  // are applied. this could be handy if you want a consistent size on different assets to share
  // transformations for instance


  // Standard Cropping/Resizing
  // The final crop and resize for the image to be delivered after any transformations are applied

  const baseTransformations = {};
  const overrideTransformations = [];

  // Only apply a crop if we're defining some type of dimension attribute
  // where the crop would make sense

  if ( crop && ( hasDefinedDimensions || hasValidAspectRatio ) ) {
    overrideTransformations.push(`c_${crop}`);
  }

  // Aspect Ratio requires a crop mode to be applied so we want to make
  // sure a valid one is included

  if ( hasValidAspectRatio ) {
    overrideTransformations.push(`ar_${aspectRatio}`);
  }

  if ( width ) {
    overrideTransformations.push(`w_${width}`);
  }

  // Some crop types don't need a height and will resize based
  // on the aspect ratio

  if ( !['limit'].includes(crop) && typeof height === 'number' ) {
    overrideTransformations.push(`h_${height}`);
  }

  // Gravity of auto only applies to certain crop types otherewise
  // errors, so default to auto only when crop matches type

  if ( !gravity && cropsGravityAuto.includes(crop) ) {
    gravity = 'auto';
  }

  // If we have gravity, apply it, but check that the gravity passed
  // in doesn't conflict with the crop mode

  if ( gravity ) {
    if ( gravity === 'auto' && !cropsGravityAuto.includes(crop) ) {
      console.warn(`Auto gravity can only be used with crop modes: ${cropsGravityAuto.join(', ')}. Not applying gravity.`);
    } else {
      overrideTransformations.push(`g_${gravity}`);gravity = gravity;
    }
  }

  // Some zoom types don't work with some crop types

  if ( zoom ) {
    if ( zoom === 'auto' && !cropsWithZoom.includes(crop) ) {
      console.warn(`Zoom can only be used with crop modes: ${cropsWithZoom.join(', ')}. Not applying zoom.`);
    } else {
      overrideTransformations.push(`z_${zoom}`);
    }
  }

  // Finally apply the constructed transformation string to the image instance

  // cldAsset.effect(transformationString);

  // if ( widthResize ) {
  //   overrides.width = widthResize;
  // }
  
  const results: PluginResults = {};

  if ( overrideTransformations.length > 0 ) {
    results.resize = overrideTransformations.join(',');
  }

  return results
}
