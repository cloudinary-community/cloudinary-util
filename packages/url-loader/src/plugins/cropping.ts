import { z } from 'zod';

import { PluginSettings, PluginOverrides } from '../types/plugins';

const cropsAspectRatio = [ 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsGravityAuto = [ 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsWithZoom = ['crop', 'thumb'];

export const pluginProps = {
  aspectRatio: z.union([
      z.string(),
      z.number()
    ])
    .describe(JSON.stringify({
      text: 'Crops or resizes the asset to a new aspect ratio.',
      url: 'https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio'
    }))
    .optional(),
  crop: z.string()
    .default('scale')
    .describe(JSON.stringify({
      text: 'Mode to use when cropping an asset.',
      url: 'https://cloudinary.com/documentation/transformation_reference#c_crop_resize'
    }))
    .optional(),
  gravity: z.string()
    .default('auto')
    .describe(JSON.stringify({
      text: 'Determines which part of an asset to focus on. Note: Default of auto is applied for supported crop modes only.',
      url: 'https://cloudinary.com/documentation/transformation_reference#g_gravity'
    }))
    .optional(),
  widthResize: z.union([
      z.string(),
      z.number()
    ])
    .describe(JSON.stringify({
      text: 'Width to resize the asset after all transformations are applied. Useful for responsive resizing.',
    }))
    .optional(),
  zoom: z.string()
    .describe(JSON.stringify({
      text: 'Controls how close to crop to the detected coordinates when using face-detection, custom-coordinate, or object-specific gravity.',
      url: 'https://cloudinary.com/documentation/transformation_reference#z_zoom'
    }))
    .optional()
};

export const props = Object.entries(pluginProps).map(([name]) => name);
export const assetTypes = ['image', 'images', 'video', 'videos'];

/**
 * normalizeNumberParameter
 * TODO: move into util
 */

export function normalizeNumberParameter(param: number | string | undefined) {
  if ( typeof param !== 'string' ) return param;
  return parseInt(param)
}

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;

  const {
    aspectRatio,
    width: defaultWidth,
    height: defaultHeight,
    widthResize: defaultWidthResize,
    // Default the crop to "limit" to avoid upscaling, even when widthResize is passed in.
    // This avoid further distorting the image since the browser will resize in that case.
    // If caller wants actual resize, can explicitly pass in "scale".
    crop = 'limit'
  } = options;

  const overrides: PluginOverrides = {
    width: undefined
  };

  // Normalize sizing parameters

  let height = normalizeNumberParameter(defaultHeight);
  let width = normalizeNumberParameter(defaultWidth);
  let widthResize = normalizeNumberParameter(defaultWidthResize);

  const hasDefinedDimensions = height || width;
  const hasValidAspectRatio = aspectRatio && cropsAspectRatio.includes(crop);

  let transformationString = '';

  // Only apply a crop if we're defining some type of dimension attribute
  // where the crop would make sense

  if ( crop && ( hasDefinedDimensions || hasValidAspectRatio ) ) {
    transformationString = `c_${crop}`;
  }

  // Aspect Ratio requires a crop mode to be applied so we want to make
  // sure a valid one is included

  if ( hasValidAspectRatio ) {
    transformationString = `${transformationString},ar_${aspectRatio}`;
  }

  if ( width ) {
    transformationString = `${transformationString},w_${width}`;
  }

  // Gravity of auto only applies to certain crop types otherewise
  // errors, so default to auto only when crop matches type

  if ( !options.gravity && cropsGravityAuto.includes(crop) ) {
    options.gravity = 'auto';
  }

  // Some crop types don't need a height and will resize based
  // on the aspect ratio

  if ( !['limit'].includes(crop) && typeof height === 'number' ) {
    transformationString = `${transformationString},h_${height}`;
  }

  // If we have gravity, apply it, but check that the gravity passed
  // in doesn't conflict with the crop mode

  if ( options.gravity ) {
    if ( options.gravity === 'auto' && !cropsGravityAuto.includes(crop) ) {
      console.warn(`Auto gravity can only be used with crop modes: ${cropsGravityAuto.join(', ')}. Not applying gravity.`);
    } else {
      transformationString = `${transformationString},g_${options.gravity}`;
    }
  }

  // Some zoom types don't work with some crop types

  if ( options.zoom ) {
    if ( options.zoom === 'auto' && !cropsWithZoom.includes(crop) ) {
      console.warn(`Zoom can only be used with crop modes: ${cropsWithZoom.join(', ')}. Not applying zoom.`);
    } else {
      transformationString = `${transformationString},z_${options.zoom}`;
    }
  }

  // Finally apply the constructed transformation string to the image instance

  cldAsset.effect(transformationString);

  if ( widthResize ) {
    overrides.width = widthResize;
  }

  return {
    options: overrides
  }
}
