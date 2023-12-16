import { z } from 'zod';

export const angle = {
  qualifier: 'a',
  schema: z.union([
      z.string(),
      z.number()
    ])
    .describe(JSON.stringify({
      text: 'Rotates or flips an asset by the specified number of degrees or automatically according to its orientation or available metadata.',
      url: 'https://cloudinary.com/documentation/transformation_reference#a_angle'
    })),
}

export const aspectRatioModesEnum = z.enum([
  'vflip',
  'hflip',
  'ignore',
  'auto_right',
  'auto_left',
])

export const aspectRatio = {
  qualifier: 'ar',
  schema: z.union([
      z.number(),
      aspectRatioModesEnum,
      z.string(),
    ])
    .describe(JSON.stringify({
      text: 'Crops or resizes the asset to a new aspect ratio.',
      url: 'https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio'
    })),
}

export const cropModesEnum = z.enum([
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
  schema: cropModesEnum
    .describe(JSON.stringify({
      text: 'Mode to use when cropping an asset.',
      url: 'https://cloudinary.com/documentation/transformation_reference#c_crop_resize'
    })),
}

export const flagsEnum = z.enum([
  'animated',
  'any_format',
  'apng',
  'attachment',
  'awebp',
  'clip',
  'clip_evenodd',
  'cutter',
  'force_icc',
  'force_strip',
  'getinfo',
  'group4',
  'hlsv3',
  'ignore_aspect_ratio',
  'ignore_mask_channels',
  'immutable_cache',
  'keep_attribution',
  'keep_dar',
  'keep_iptc',
  'layer_apply',
  'lossy',
  'mono',
  'no_overflow',
  'no_stream',
  'png8_fl_png24_fl_png32',
  'preserve_transparency',
  'progressive',
  'rasterize',
  'region_relative',
  'relative',
  'replace_image',
  'sanitize',
  'splice',
  'streaming_attachment',
  'strip_profile',
  'text_disallow_overflow',
  'text_no_trim',
  'tiff8_lzw',
  'tiled',
  'truncate_ts',
  'waveform',
]);

export const flags = {
  qualifier: 'fl',
  schema: z.union([
      flagsEnum,
      z.array(flagsEnum)
    ])
    .describe(JSON.stringify({
      text: 'Alters the regular behavior of another transformation or the overall delivery behavior.',
      url: 'https://cloudinary.com/documentation/transformation_reference#fl_flag'
    }))
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

export const x = {
  qualifier: 'x',
  schema: z.union([
      z.string(),
      z.number()
    ])
    .describe(JSON.stringify({
      text: 'Adjusts the starting location or offset of the x axis.',
      url: 'https://cloudinary.com/documentation/transformation_reference#x_y_coordinates'
    })),
}

export const y = {
  qualifier: 'y',
  schema: z.union([
      z.string(),
      z.number()
    ])
    .describe(JSON.stringify({
      text: 'Adjusts the starting location or offset of the y axis.',
      url: 'https://cloudinary.com/documentation/transformation_reference#x_y_coordinates'
    })),
}

export const zoom = {
  schema: z.string()
    .describe(JSON.stringify({
      text: 'Controls how close to crop to the detected coordinates when using face-detection, custom-coordinate, or object-specific gravity.',
      url: 'https://cloudinary.com/documentation/transformation_reference#z_zoom'
    })),
}