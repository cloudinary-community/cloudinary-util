import { z } from 'zod';
import { testColorIsHex, convertColorHexToRgb } from '@cloudinary-util/util';

import { Qualifier } from '../types/qualifiers';

const convertersColors = [
  {
    test: testColorIsHex,
    convert: convertColorHexToRgb
  }
]

export const primary: Record<string, Qualifier> = {
  aspectRatio: {
    qualifier: 'ar',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'A qualifier that crops or resizes the asset to a new aspect ratio.',
        url: 'https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio',
      }))
      .optional(),
  },
  crop: {
    qualifier: 'c',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Changes the size of the delivered asset according to the requested width & height dimensions.',
        url: 'https://cloudinary.com/documentation/transformation_reference#c_crop_resize',
      }))
      .optional(),
  },
  gravity: {
    qualifier: 'g',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'A qualifier that determines which part of an asset to focus on.',
        url: 'https://cloudinary.com/documentation/transformation_reference#g_gravity',
      }))
      .optional(),
  },
  height: {
    qualifier: 'h',
    schema: z.union([
        z.number(),
        z.string()
      ])
      .describe(JSON.stringify({
        text: 'A qualifier that determines the height of a transformed asset or an overlay.',
        url: 'https://cloudinary.com/documentation/transformation_reference#h_height',
      }))
      .optional(),
  },
  width: {
    qualifier: 'w',
    schema: z.union([
        z.number(),
        z.string()
      ])
      .describe(JSON.stringify({
        text: 'A qualifier that sets the desired width of an asset using a specified value, or automatically based on the available width.',
        url: 'https://cloudinary.com/documentation/transformation_reference#w_width',
      }))
      .optional(),
  },
} as const;

export const position: Record<string, Qualifier> = {
  angle: {
    qualifier: 'a'
  },
  gravity: {
    qualifier: 'g'
  },
  x: {
    qualifier: 'x'
  },
  y: {
    qualifier: 'y'
  },
} as const;

export const text: Record<string, Qualifier> = {
  alignment: {
    qualifier: false,
    order: 6
  },
  antialias: {
    qualifier: 'antialias'
  },
  border: {
    qualifier: 'bo',
    location: 'primary'
  },
  color: {
    qualifier: 'co',
    location: 'primary',
    converters: convertersColors
  },
  fontFamily: {
    qualifier: false,
    order: 1
  },
  fontSize: {
    qualifier: false,
    order: 2
  },
  fontStyle: {
    qualifier: false,
    order: 4
  },
  fontWeight: {
    qualifier: false,
    order: 3
  },
  hinting: {
    qualifier: 'hinting'
  },
  letterSpacing: {
    qualifier: 'letter_spacing'
  },
  lineSpacing: {
    qualifier: 'line_spacing'
  },
  stroke: {
    qualifier: 'self',
    order: 7
  },
  textDecoration: {
    qualifier: false,
    order: 5
  }
} as const;

export const effects: Record<string, Qualifier> = {
  art: {
    prefix: 'e',
    qualifier: 'art',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Applies the selected artistic filter.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_art',
      }))
      .optional(),
  },
  autoBrightness: {
    prefix: 'e',
    qualifier: 'auto_brightness',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Automatically adjusts the image brightness and blends the result with the original image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_auto_brightness',
      }))
      .optional(),
  },
  autoColor: {
    prefix: 'e',
    qualifier: 'auto_color',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Automatically adjusts the image color balance and blends the result with the original image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_auto_color',
      }))
      .optional(),
  },
  autoContrast: {
    prefix: 'e',
    qualifier: 'auto_contrast',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Automatically adjusts the image contrast and blends the result with the original image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_auto_contrast',
      }))
      .optional(),
  },
  assistColorblind: {
    prefix: 'e',
    qualifier: 'assist_colorblind',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies stripes or color adjustment to help people with common color blind conditions to differentiate between colors that are similar for them.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_assist_colorblind',
      }))
      .optional(),
  },
  background: {
    qualifier: 'b',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Applies a background to empty or transparent areas.',
        url: 'https://cloudinary.com/documentation/transformation_reference#b_background',
      }))
      .optional(),
  },
  blackwhite: {
    prefix: 'e',
    qualifier: 'blackwhite',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Converts an image to black and white.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_blackwhite',
      }))
      .optional(),
  },
  blur: {
    prefix: 'e',
    qualifier: 'blur',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a blurring filter to an asset.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_blur',
      }))
      .optional(),
  },
  blurFaces: {
    prefix: 'e',
    qualifier: 'blur_faces',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Blurs all detected faces in an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_blur_faces',
      }))
      .optional(),
  },
  blurRegion: {
    prefix: 'e',
    qualifier: 'blur_region',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a blurring filter to the region of an image specified by x, y, width and height, or an area of text. If no region is specified, the whole image is blurred.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_blur_region',
      }))
      .optional(),
  },
  border: {
    qualifier: 'bo',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Adds a solid border around an image or video.',
        url: 'https://cloudinary.com/documentation/transformation_reference#bo_border',
      }))
      .optional(),
  },
  brightness: {
    prefix: 'e',
    qualifier: 'brightness',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts the image or video brightness.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_brightness',
      }))
      .optional(),
  },
  brightnessHSB: {
    prefix: 'e',
    qualifier: 'brightness_hsb',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts image brightness modulation in HSB to prevent artifacts in some images.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_brightness_hsb',
      }))
      .optional(),
  },
  cartoonify: {
    prefix: 'e',
    qualifier: 'cartoonify',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a cartoon effect to an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_cartoonify',
      }))
      .optional(),
  },
  color: {
    qualifier: 'co',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'A qualifier that specifies the color to use with the corresponding transformation.',
        url: 'https://cloudinary.com/documentation/transformation_reference#co_color',
      }))
      .optional(),
    converters: convertersColors
  },
  colorize: {
    prefix: 'e',
    qualifier: 'colorize',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Colorizes an image. By default, gray is used for colorization. You can specify a different color using the color qualifier.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_colorize',
      }))
      .optional(),
  },
  contrast: {
    prefix: 'e',
    qualifier: 'contrast',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts an image or video contrast.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_contrast',
      }))
      .optional(),
  },
  displace: {
    prefix: 'e',
    qualifier: 'distort',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Displaces the pixels in an image according to the color channels of the pixels in another specified image (a gradient map specified with the overlay parameter).',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_displace',
      }))
      .optional(),
  },
  distort: {
    prefix: 'e',
    qualifier: 'distort',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Distorts an image to a new shape by either adjusting its corners or by warping it into an arc.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_distort',
      }))
      .optional(),
  },
  fillLight: {
    prefix: 'e',
    qualifier: 'fill_light',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts the fill light and optionally blends the result with the original image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_fill_light',
      }))
      .optional(),
  },
  gamma: {
    prefix: 'e',
    qualifier: 'gamma',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts the image or video gamma level.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_gamma',
      }))
      .optional(),
  },
  gradientFade: {
    prefix: 'e',
    qualifier: 'gradient_fade',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a gradient fade effect from the edge of an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_gradient_fade',
      }))
      .optional(),
  },
  grayscale: {
    prefix: 'e',
    qualifier: 'grayscale',
    schema: z.boolean()
      .describe(JSON.stringify({
        text: 'Converts an image to grayscale (multiple shades of gray).',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_grayscale',
      }))
      .optional(),
  },
  hue: {
    prefix: 'e',
    qualifier: 'hue',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts an image\'s hue.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_hue',
      }))
      .optional(),
  },
  improve: {
    prefix: 'e',
    qualifier: 'improve',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts an image\'s colors, contrast and brightness to improve its appearance.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_improve',
      }))
      .optional(),
  },
  multiply: {
    prefix: 'e',
    qualifier: 'multiply',
    schema: z.boolean()
      .describe(JSON.stringify({
        text: 'A qualifier that blends image layers using the multiply blend mode',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_multiply',
      }))
      .optional(),
  },
  negate: {
    prefix: 'e',
    qualifier: 'negate',
    schema: z.union([
        z.string(),
        z.boolean(),
      ])
      .describe(JSON.stringify({
        text: 'https://cloudinary.com/documentation/transformation_reference#e_negate',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_negate',
      }))
      .optional(),
  },
  noise: {
    prefix: 'e',
    qualifier: 'noise',
    schema: z.boolean()
      .describe(JSON.stringify({
        text: 'https://cloudinary.com/documentation/transformation_reference#e_noise',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_noise',
      }))
      .optional(),
  },
  oilPaint: {
    prefix: 'e',
    qualifier: 'oil_paint',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'https://cloudinary.com/documentation/transformation_reference#e_oil_paint',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_oil_paint',
      }))
      .optional(),
  },
  opacity: {
    qualifier: 'o',
    schema: z.union([
        z.string(),
        z.number()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts the opacity of an asset and makes it semi-transparent.',
        url: 'https://cloudinary.com/documentation/transformation_reference#o_opacity',
      }))
      .optional(),
  },
  outline: {
    prefix: 'e',
    qualifier: 'outline',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adds an outline effect to an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_outline',
      }))
      .optional(),
  },
  pixelate: {
    prefix: 'e',
    qualifier: 'pixelate',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a pixelation effect.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_pixelate',
      }))
      .optional(),
  },
  pixelateFaces: {
    prefix: 'e',
    qualifier: 'pixelate_faces',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Pixelates all detected faces in an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_pixelate_faces',
      }))
      .optional(),
  },
  pixelateRegion: {
    prefix: 'e',
    qualifier: 'pixelate_region',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Pixelates the region of an image specified by x, y, width and height, or an area of text.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_pixelate_region',
      }))
      .optional(),
  },
  radius: {
    qualifier: 'r',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Rounds the corners of an image or video.',
        url: 'https://cloudinary.com/documentation/transformation_reference#r_round_corners',
      }))
      .optional(),
  },
  redeye: {
    prefix: 'e',
    qualifier: 'redeye',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Automatically removes red eyes in an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_redeye',
      }))
      .optional(),
  },
  replaceColor: {
    prefix: 'e',
    qualifier: 'replace_color',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Maps an input color and those similar to the input color to corresponding shades of a specified output color.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_replace_color',
      }))
      .optional(),
  },
  saturation: {
    prefix: 'e',
    qualifier: 'saturation',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adjusts an image or video saturation level.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_saturation',
      }))
      .optional(),
  },
  screen: {
    prefix: 'e',
    qualifier: 'screen',
    schema: z.boolean()
      .describe(JSON.stringify({
        text: 'A qualifier that blends image layers using the screen blend mode.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_screen',
      }))
      .optional(),
  },
  sepia: {
    prefix: 'e',
    qualifier: 'sepia',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Changes the color scheme of an image to sepia.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_sepia',
      }))
      .optional(),
  },
  shadow: {
    prefix: 'e',
    qualifier: 'shadow',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Adds a gray shadow to the bottom right of an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_shadow',
      }))
      .optional(),
  },
  sharpen: {
    prefix: 'e',
    qualifier: 'sharpen',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a sharpening filter.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_sharpen',
      }))
      .optional(),
  },
  shear: {
    prefix: 'e',
    qualifier: 'shear',
    schema: z.string()
      .describe(JSON.stringify({
        text: 'Skews an image according to the two specified values in degrees.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_shear',
      }))
      .optional(),
  },
  simulateColorblind: {
    prefix: 'e',
    qualifier: 'simulate_colorblind',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Simulates the way an image would appear to someone with the specified color blind condition.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_simulate_colorblind',
      }))
      .optional(),
  },
  tint: {
    prefix: 'e',
    qualifier: 'tint',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Blends an image with one or more tint colors at a specified intensity.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_tint',
      }))
      .optional(),
  },
  trim: {
    prefix: 'e',
    qualifier: 'trim',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Detects and removes image edges whose color is similar to the corner pixels.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_trim',
      }))
      .optional(),
  },
  unsharpMask: {
    prefix: 'e',
    qualifier: 'unsharp_mask',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies an unsharp mask filter to an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_unsharp_mask',
      }))
      .optional(),
  },
  vectorize: {
    prefix: 'e',
    qualifier: 'vectorize',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Vectorizes an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_vectorize',
      }))
      .optional(),
  },
  vibrance: {
    prefix: 'e',
    qualifier: 'vibrance',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a vibrance filter to an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_vibrance',
      }))
      .optional(),
  },
  vignette: {
    prefix: 'e',
    qualifier: 'vignette',
    schema: z.union([
        z.string(),
        z.boolean()
      ])
      .describe(JSON.stringify({
        text: 'Applies a vignette effect to an image.',
        url: 'https://cloudinary.com/documentation/transformation_reference#e_vignette',
      }))
      .optional(),
  },
} as const;

export const flags: Record<string, Qualifier> = {
  animated: {
    prefix: 'fl',
    qualifier: 'animated'
  },
  anyFormat: {
    prefix: 'fl',
    qualifier: 'any_format'
  },
  apng: {
    prefix: 'fl',
    qualifier: 'apng'
  },
  attachment: {
    prefix: 'fl',
    qualifier: 'attachment'
  },
  awebp: {
    prefix: 'fl',
    qualifier: 'awebp'
  },
  clip: {
    prefix: 'fl',
    qualifier: 'clip'
  },
  clipEvenodd: {
    prefix: 'fl',
    qualifier: 'clip_evenodd'
  },
  cutter: {
    prefix: 'fl',
    qualifier: 'cutter'
  },
  draco: {
    prefix: 'fl',
    qualifier: 'draco'
  },
  forceIcc: {
    prefix: 'fl',
    qualifier: 'force_icc'
  },
  forceStrip: {
    prefix: 'fl',
    qualifier: 'force_strip'
  },
  getinfo: {
    prefix: 'fl',
    qualifier: 'getinfo'
  },
  group4: {
    prefix: 'fl',
    qualifier: 'group4'
  },
  hlsv3: {
    prefix: 'fl',
    qualifier: 'hlsv3'
  },
  ignoreAspectRatio: {
    prefix: 'fl',
    qualifier: 'ignore_aspect_ratio'
  },
  ignoreMaskChannels: {
    prefix: 'fl',
    qualifier: 'ignore_mask_channels'
  },
  immutableCache: {
    prefix: 'fl',
    qualifier: 'immutable_cache'
  },
  keepAttribution: {
    prefix: 'fl',
    qualifier: 'keep_attribution'
  },
  keepDar: {
    prefix: 'fl',
    qualifier: 'keep_dar'
  },
  keepIptc: {
    prefix: 'fl',
    qualifier: 'keep_iptc'
  },
  layerApply: {
    prefix: 'fl',
    qualifier: 'layer_apply'
  },
  lossy: {
    prefix: 'fl',
    qualifier: 'lossy'
  },
  mono: {
    prefix: 'fl',
    qualifier: 'mono'
  },
  noOverflow: {
    prefix: 'fl',
    qualifier: 'no_overflow'
  },
  noStream: {
    prefix: 'fl',
    qualifier: 'no_stream'
  },
  png8: {
    prefix: 'fl',
    qualifier: 'png8'
  },
  png24: {
    prefix: 'fl',
    qualifier: 'png24'
  },
  png32: {
    prefix: 'fl',
    qualifier: 'png32'
  },
  preserveTransparency: {
    prefix: 'fl',
    qualifier: 'preserve_transparency'
  },
  progressive: {
    prefix: 'fl',
    qualifier: 'progressive'
  },
  rasterize: {
    prefix: 'fl',
    qualifier: 'rasterize'
  },
  regionRelative: {
    prefix: 'fl',
    qualifier: 'region_relative'
  },
  relative: {
    prefix: 'fl',
    qualifier: 'relative',
    location: 'primary'
  },
  replaceImage: {
    prefix: 'fl',
    qualifier: 'replace_image'
  },
  sanitize: {
    prefix: 'fl',
    qualifier: 'sanitize'
  },
  splice: {
    prefix: 'fl',
    qualifier: 'splice'
  },
  streamingAttachment: {
    prefix: 'fl',
    qualifier: 'streaming_attachment'
  },
  stripProfile: {
    prefix: 'fl',
    qualifier: 'strip_profile'
  },
  textDisallowOverflow: {
    prefix: 'fl',
    qualifier: 'text_disallow_overflow'
  },
  textNoTrim: {
    prefix: 'fl',
    qualifier: 'text_no_trim'
  },
  tif8Lzw: {
    prefix: 'fl',
    qualifier: 'tif8_lzw'
  },
  tiled: {
    prefix: 'fl',
    qualifier: 'tiled'
  },
  truncateTs: {
    prefix: 'fl',
    qualifier: 'truncate_ts'
  },
  waveform: {
    prefix: 'fl',
    qualifier: 'waveform'
  },
} as const;