import { z } from 'zod';

export const aspectRatio = {
  qualifier: 'ar',
  schema: z.union([
      z.string(),
      z.number()
    ])
    .describe(JSON.stringify({
      text: 'Crops or resizes the asset to a new aspect ratio.',
      url: 'https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio'
    })),
}

export const cropModesSchema = z.enum([
  'fill',
  'lfill',
  'fill_pad',
  'crop',
  'thumb',
  'scale',
  'fit',
  'limit',
  'mfit',
  'pad',
  'lpad',
  'mpad',
  'imagga_scale',
  'imagga_crop',
]);

export const crop = {
  qualifier: 'c',
  schema: cropModesSchema
    .describe(JSON.stringify({
      text: 'Mode to use when cropping an asset.',
      url: 'https://cloudinary.com/documentation/transformation_reference#c_crop_resize'
    })),
}

export const gravity = {
  qualifier: 'g',
  schema: z.string()
    .describe(JSON.stringify({
      text: 'Determines which part of an asset to focus on. Note: Default of auto is applied for supported crop modes only.',
      url: 'https://cloudinary.com/documentation/transformation_reference#g_gravity'
    })),
}

export const height = {
  qualifier: 'h',
  schema: z.union([
      z.number(),
      z.string()
    ])
    .describe(JSON.stringify({
      text: 'A qualifier that determines the height of a transformed asset or an overlay.',
      url: 'https://cloudinary.com/documentation/transformation_reference#h_height',
    })),
}

export const width = {
  qualifier: 'w',
  schema: z.union([
      z.number(),
      z.string()
    ])
    .describe(JSON.stringify({
      text: 'A qualifier that sets the desired width of an asset using a specified value, or automatically based on the available width.',
      url: 'https://cloudinary.com/documentation/transformation_reference#w_width',
    })),
}

export const widthResize = {
  schema: z.union([
      z.string(),
      z.number()
    ])
    .describe(JSON.stringify({
      text: 'Width to resize the asset after all transformations are applied. Useful for responsive resizing.',
    })),
}

export const zoom = {
  schema: z.string()
    .describe(JSON.stringify({
      text: 'Controls how close to crop to the detected coordinates when using face-detection, custom-coordinate, or object-specific gravity.',
      url: 'https://cloudinary.com/documentation/transformation_reference#z_zoom'
    })),
}