import * as parameters from '../constants/parameters';

import { PluginSettings, PluginResults } from '../types/plugins';

import { normalizeNumberParameter } from '../lib/transformations';

const cropsAspectRatio = [ 'auto', 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsGravityAuto = [ 'auto', 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsWithZoom = ['crop', 'thumb'];

const DEFAULT_CROP = 'limit';

export const props = {
  aspectRatio: parameters.aspectRatio.schema.optional(),
  baseAspectRatio: parameters.baseAspectRatio.schema.optional(),
  baseCrop: parameters.baseCrop.schema.optional(),
  baseGravity: parameters.baseGravity.schema.optional(),
  baseHeight: parameters.baseHeight.schema.optional(),
  baseWidth: parameters.baseWidth.schema.optional(),
  baseZoom: parameters.baseZoom.schema.optional(),
  crop: parameters.crop.schema.default(DEFAULT_CROP).optional(),
  gravity: parameters.gravity.schema.optional(),
  zoom: parameters.zoom.schema.optional(),
};

export const assetTypes = ['image', 'images', 'video', 'videos'];


export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;

  
  // Standard Cropping/Resizing
  // The final crop and resize for the image to be delivered after any transformations are applied

  const overrideTransformations = collectTransformations({
    aspectRatio: options.aspectRatio,
    width: options.width,
    height: options.height,
    gravity: options.gravity,
    crop: options.crop,
    zoom: options.zoom,
  });

  // Base Resizing/Cropping
  // This stage provides the option for someone to crop and resize the image before any transformations
  // are applied. this could be handy if you want a consistent size on different assets to share
  // transformations for instance

  const baseTransformations = collectTransformations({
    aspectRatio: options.baseAspectRatio,
    width: options.baseWidth,
    height: options.baseHeight,
    gravity: options.baseGravity,
    crop: options.baseCrop,
    zoom: options.baseZoom,
  });

  function collectTransformations(collectOptions: Pick<PluginSettings['options'], "aspectRatio" | "crop" | "gravity" | "height" | "width" | "zoom">) {
    // Default the crop to "limit" to avoid upscaling
    // This avoid further distorting the image since the browser will resize in that case.
    // If caller wants actual resize, can explicitly pass in "scale".
    const { aspectRatio, crop = DEFAULT_CROP, zoom } = collectOptions;

    // Normalize sizing parameters

    let gravity = collectOptions.gravity;
    let height = normalizeNumberParameter(collectOptions.height);
    let width = normalizeNumberParameter(collectOptions.width);

    const transformations = [];

    const hasDefinedDimensions = height || width;
    const hasValidAspectRatio = aspectRatio && cropsAspectRatio.includes(crop);

    // Only apply a crop if we're defining some type of dimension attribute
    // where the crop would make sense

    if ( crop && ( hasDefinedDimensions || hasValidAspectRatio ) ) {
      transformations.push(`c_${crop}`);
    }

    // Aspect Ratio requires a crop mode to be applied so we want to make
    // sure a valid one is included

    if ( hasValidAspectRatio ) {
      transformations.push(`ar_${aspectRatio}`);
    }

    if ( width ) {
      transformations.push(`w_${width}`);
    }

    // Some crop types don't need a height and will resize based
    // on the aspect ratio

    if ( !['limit'].includes(crop) && typeof height === 'number' ) {
      transformations.push(`h_${height}`);
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
        transformations.push(`g_${gravity}`);
      }
    }

    // Some zoom types don't work with some crop types

    if ( zoom ) {
      if ( zoom === 'auto' && !cropsWithZoom.includes(crop) ) {
        console.warn(`Zoom can only be used with crop modes: ${cropsWithZoom.join(', ')}. Not applying zoom.`);
      } else {
        transformations.push(`z_${zoom}`);
      }
    }

    return transformations;
  }

  // If we have any base canvas transformations, add them to the image instance

  if ( baseTransformations.length > 0 ) {
    cldAsset.addTransformation(baseTransformations.join(','));
  }

  // If we have any overrides, which are the the standard width/height options, apply 
  
  const results: PluginResults = {};

  if ( overrideTransformations.length > 0 ) {
    results.resize = overrideTransformations.join(',');
  }

  return results
}
