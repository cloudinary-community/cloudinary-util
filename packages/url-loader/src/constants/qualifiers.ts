import { convertColorHexToRgb, testColorIsHex } from "@cloudinary-util/util";

import type { OptionName } from "../lib/plugin.js";
import type {
  QualifierConfig,
  QualifierConverters,
} from "../types/qualifiers.js";
import type { Angle, PositionalOptions } from "./parameters.js";

const convertersColors: QualifierConverters[] = [
  {
    test: testColorIsHex,
    convert: convertColorHexToRgb,
  },
];

export const primary: { [k in OptionName]?: QualifierConfig } = {
  aspectRatio: {
    qualifier: "ar",
  },
  crop: {
    qualifier: "c",
  },
  gravity: {
    qualifier: "g",
  },
  height: {
    qualifier: "h",
  },
  width: { qualifier: "w" },
};

export const position: { [k in keyof PositionalOptions]-?: QualifierConfig } = {
  angle: {
    qualifier: "a",
  },
  gravity: {
    qualifier: "g",
  },
  x: { qualifier: "x" },
  y: { qualifier: "y" },
};

export const text = {
  alignment: {
    qualifier: false,
    order: 6,
  },
  antialias: {
    qualifier: "antialias",
  },
  border: {
    qualifier: "bo",
    location: "primary",
  },
  color: {
    qualifier: "co",
    location: "primary",
    converters: convertersColors,
  },
  fontFamily: {
    qualifier: false,
    order: 1,
  },
  fontSize: {
    qualifier: false,
    order: 2,
  },
  fontStyle: {
    qualifier: false,
    order: 4,
  },
  fontWeight: {
    qualifier: false,
    order: 3,
  },
  hinting: {
    qualifier: "hinting",
  },
  letterSpacing: {
    qualifier: "letter_spacing",
  },
  lineSpacing: {
    qualifier: "line_spacing",
  },
  stroke: {
    qualifier: "self",
    order: 7,
  },
  textDecoration: {
    qualifier: false,
    order: 5,
  },
} as const satisfies Record<string, QualifierConfig | undefined>;

export interface QualifierOptions {
  angle?: Angle;

  /**
   * @description Applies the selected artistic filter.
   * @url https://cloudinary.com/documentation/transformation_reference#e_art
   */
  art?: string;

  /**
   * @description Automatically adjusts the image brightness and blends the result with the original image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_auto_brightness
   */
  autoBrightness?: boolean | string;

  /**
   * @description Automatically adjusts the image color balance and blends the result with the original image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_auto_color
   */
  autoColor?: boolean | string;

  /**
   * @description Automatically adjusts the image contrast and blends the result with the original image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_auto_contrast
   */
  autoContrast?: boolean | string;

  /**
   * @description Applies stripes or color adjustment to help people with common color blind conditions to differentiate between colors that are similar for them.
   * @url https://cloudinary.com/documentation/transformation_reference#e_assist_colorblind
   */
  assistColorblind?: boolean | string;

  /**
   * @description Applies a background to empty or transparent areas.
   * @url https://cloudinary.com/documentation/transformation_reference#b_background
   */
  background?: string;

  /**
   * @description Converts an image to black and white.
   * @url https://cloudinary.com/documentation/transformation_reference#e_blackwhite
   */
  blackwhite?: boolean | string;

  /**
   * @description Applies a blurring filter to an asset.
   * @url https://cloudinary.com/documentation/transformation_reference#e_blur
   */
  blur?: boolean | string;

  /**
   * @description Blurs all detected faces in an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_blur_faces
   */
  blurFaces?: boolean | string;

  /**
   * @description Applies a blurring filter to the region of an image specified by x, y, width and height, or an area of text. If no region is specified, the whole image is blurred.
   * @url https://cloudinary.com/documentation/transformation_reference#e_blur_region
   */
  blurRegion?: boolean | string;

  /**
   * @description Adds a solid border around an image or video.
   * @url https://cloudinary.com/documentation/transformation_reference#bo_border
   */
  border?: string;

  /**
   * @description Adjusts the image or video brightness.
   * @url https://cloudinary.com/documentation/transformation_reference#e_brightness
   */
  brightness?: boolean | string;

  /**
   * @description Adjusts image brightness modulation in HSB to prevent artifacts in some images.
   * @url https://cloudinary.com/documentation/transformation_reference#e_brightness_hsb
   */
  brightnessHSB?: boolean | string;

  /**
   * @description Applies a cartoon effect to an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_cartoonify
   */
  cartoonify?: boolean | string;

  /**
   * @description A qualifier that specifies the color to use with the corresponding transformation.
   * @url https://cloudinary.com/documentation/transformation_reference#co_color
   */
  color?: string;

  /**
   * @description Colorizes an image. By default, gray is used for colorization. You can specify a different color using the color qualifier.
   * @url https://cloudinary.com/documentation/transformation_reference#e_colorize
   */
  colorize?: string;

  /**
   * @description Adjusts an image or video contrast.
   * @url https://cloudinary.com/documentation/transformation_reference#e_contrast
   */
  contrast?: boolean | string;

  /**
   * @description Displaces the pixels in an image according to the color channels of the pixels in another specified image (a gradient map specified with the overlay parameter).
   * @url https://cloudinary.com/documentation/transformation_reference#e_displace
   */
  displace?: string;

  /**
   * @description Distorts an image to a new shape by either adjusting its corners or by warping it into an arc.
   * @url https://cloudinary.com/documentation/transformation_reference#e_distort
   */
  distort?: string;

  /**
   * @description Adjusts the fill light and optionally blends the result with the original image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_fill_light
   */
  fillLight?: boolean | string;

  /**
   * @description Adjusts the image or video gamma level.
   * @url https://cloudinary.com/documentation/transformation_reference#e_gamma
   */
  gamma?: boolean | string;

  /**
   * @description Applies a gradient fade effect from the edge of an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_gradient_fade
   */
  gradientFade?: boolean | string;

  /**
   * @description Converts an image to grayscale (multiple shades of gray).
   * @url https://cloudinary.com/documentation/transformation_reference#e_grayscale
   */
  grayscale?: boolean;

  /**
   * @description Adjusts an image's hue.
   * @url https://cloudinary.com/documentation/transformation_reference#e_hue
   */
  hue?: boolean | string;

  /**
   * @description Adjusts an image's colors, contrast and brightness to improve its appearance.
   * @url https://cloudinary.com/documentation/transformation_reference#e_improve
   */
  improve?: boolean | string;

  /**
   * @description Loops a video or animated image the specified number of times.
   * @url https://cloudinary.com/documentation/transformation_reference#e_loop
   */
  loop?: boolean | number | string;

  /**
   * @description A qualifier that blends image layers using the multiply blend mode.
   * @url https://cloudinary.com/documentation/transformation_reference#e_multiply
   */
  multiply?: boolean;

  /**
   * @description https://cloudinary.com/documentation/transformation_reference#e_negate
   * @url https://cloudinary.com/documentation/transformation_reference#e_negate
   */
  negate?: string | boolean;

  /**
   * @description https://cloudinary.com/documentation/transformation_reference#e_noise
   * @url https://cloudinary.com/documentation/transformation_reference#e_noise
   */
  noise?: boolean;

  /**
   * @description https://cloudinary.com/documentation/transformation_reference#e_oil_paint
   * @url https://cloudinary.com/documentation/transformation_reference#e_oil_paint
   */
  oilPaint?: string | boolean;

  /**
   * @description Adjusts the opacity of an asset and makes it semi-transparent.
   * @url https://cloudinary.com/documentation/transformation_reference#o_opacity
   */
  opacity?: string | number;

  /**
   * @description Adds an outline effect to an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_outline
   */
  outline?: boolean | string;

  /**
   * @description Applies a pixelation effect.
   * @url https://cloudinary.com/documentation/transformation_reference#e_pixelate
   */
  pixelate?: boolean | string;

  /**
   * @description Pixelates all detected faces in an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_pixelate_faces
   */
  pixelateFaces?: boolean | string;

  /**
   * @description Pixelates the region of an image specified by x, y, width and height, or an area of text.
   * @url https://cloudinary.com/documentation/transformation_reference#e_pixelate_region
   */
  pixelateRegion?: boolean | string;

  /**
   * @description Rounds the corners of an image or video.
   * @url https://cloudinary.com/documentation/transformation_reference#r_round_corners
   */
  radius?: string | number;

  /**
   * @description Automatically removes red eyes in an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_redeye
   */
  redeye?: boolean | string;

  /**
   * @description Maps an input color and those similar to the input color to corresponding shades of a specified output color.
   * @url https://cloudinary.com/documentation/transformation_reference#e_replace_color
   */
  replaceColor?: string;

  /**
   * @description Adjusts an image or video saturation level.
   * @url https://cloudinary.com/documentation/transformation_reference#e_saturation
   */
  saturation?: boolean | string;

  /**
   * @description A qualifier that blends image layers using the screen blend mode.
   * @url https://cloudinary.com/documentation/transformation_reference#e_screen
   */
  screen?: boolean;

  /**
   * @description Changes the color scheme of an image to sepia.
   * @url https://cloudinary.com/documentation/transformation_reference#e_sepia
   */
  sepia?: boolean | string;

  /**
   * @description Adds a gray shadow to the bottom right of an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_shadow
   */
  shadow?: boolean | string;

  /**
   * @description Applies a sharpening filter.
   * @url https://cloudinary.com/documentation/transformation_reference#e_sharpen
   */
  sharpen?: boolean | string;

  /**
   * @description Skews an image according to the two specified values in degrees.
   * @url https://cloudinary.com/documentation/transformation_reference#e_shear
   */
  shear?: string;

  /**
   * @description Simulates the way an image would appear to someone with the specified color blind condition.
   * @url https://cloudinary.com/documentation/transformation_reference#e_simulate_colorblind
   */
  simulateColorblind?: boolean | string;

  /**
   * @description Blends an image with one or more tint colors at a specified intensity.
   * @url https://cloudinary.com/documentation/transformation_reference#e_tint
   */
  tint?: boolean | string;

  /**
   * @description Detects and removes image edges whose color is similar to the corner pixels.
   * @url https://cloudinary.com/documentation/transformation_reference#e_trim
   */
  trim?: boolean | string;

  /**
   * @description Applies an unsharp mask filter to an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_unsharp_mask
   */
  unsharpMask?: boolean | string;

  /**
   * @description Vectorizes an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_vectorize
   */
  vectorize?: boolean | string;

  /**
   * @description Applies a vibrance filter to an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_vibrance
   */
  vibrance?: boolean | string;

  /**
   * @description Applies a vignette effect to an image.
   * @url https://cloudinary.com/documentation/transformation_reference#e_vignette
   */
  vignette?: boolean | string;
}

export const effects = {
  angle: {
    qualifier: "a",
  },
  art: {
    prefix: "e",
    qualifier: "art",
  },
  autoBrightness: {
    prefix: "e",
    qualifier: "auto_brightness",
  },
  autoColor: {
    prefix: "e",
    qualifier: "auto_color",
  },
  autoContrast: {
    prefix: "e",
    qualifier: "auto_contrast",
  },
  assistColorblind: {
    prefix: "e",
    qualifier: "assist_colorblind",
  },
  background: {
    qualifier: "b",
  },
  blackwhite: {
    prefix: "e",
    qualifier: "blackwhite",
  },
  blur: {
    prefix: "e",
    qualifier: "blur",
  },
  blurFaces: {
    prefix: "e",
    qualifier: "blur_faces",
  },
  blurRegion: {
    prefix: "e",
    qualifier: "blur_region",
  },
  border: {
    qualifier: "bo",
  },
  brightness: {
    prefix: "e",
    qualifier: "brightness",
  },
  brightnessHSB: {
    prefix: "e",
    qualifier: "brightness_hsb",
  },
  cartoonify: {
    prefix: "e",
    qualifier: "cartoonify",
  },
  color: {
    qualifier: "co",
    converters: convertersColors,
  },
  colorize: {
    prefix: "e",
    qualifier: "colorize",
  },
  contrast: {
    prefix: "e",
    qualifier: "contrast",
  },
  displace: {
    prefix: "e",
    qualifier: "distort",
  },
  distort: {
    prefix: "e",
    qualifier: "distort",
  },
  fillLight: {
    prefix: "e",
    qualifier: "fill_light",
  },
  gamma: {
    prefix: "e",
    qualifier: "gamma",
  },
  gradientFade: {
    prefix: "e",
    qualifier: "gradient_fade",
  },
  grayscale: {
    prefix: "e",
    qualifier: "grayscale",
  },
  hue: {
    prefix: "e",
    qualifier: "hue",
  },
  improve: {
    prefix: "e",
    qualifier: "improve",
  },
  loop: {
    prefix: "e",
    qualifier: "loop",
  },
  multiply: {
    prefix: "e",
    qualifier: "multiply",
  },
  negate: {
    prefix: "e",
    qualifier: "negate",
  },
  noise: {
    prefix: "e",
    qualifier: "noise",
  },
  oilPaint: {
    prefix: "e",
    qualifier: "oil_paint",
  },
  opacity: {
    qualifier: "o",
  },
  outline: {
    prefix: "e",
    qualifier: "outline",
  },
  pixelate: {
    prefix: "e",
    qualifier: "pixelate",
  },
  pixelateFaces: {
    prefix: "e",
    qualifier: "pixelate_faces",
  },
  pixelateRegion: {
    prefix: "e",
    qualifier: "pixelate_region",
  },
  radius: {
    qualifier: "r",
  },
  redeye: {
    prefix: "e",
    qualifier: "redeye",
  },
  replaceColor: {
    prefix: "e",
    qualifier: "replace_color",
  },
  saturation: {
    prefix: "e",
    qualifier: "saturation",
  },
  screen: {
    prefix: "e",
    qualifier: "screen",
  },
  sepia: {
    prefix: "e",
    qualifier: "sepia",
  },
  shadow: {
    prefix: "e",
    qualifier: "shadow",
  },
  sharpen: {
    prefix: "e",
    qualifier: "sharpen",
  },
  shear: {
    prefix: "e",
    qualifier: "shear",
  },
  simulateColorblind: {
    prefix: "e",
    qualifier: "simulate_colorblind",
  },
  tint: {
    prefix: "e",
    qualifier: "tint",
  },
  trim: {
    prefix: "e",
    qualifier: "trim",
  },
  unsharpMask: {
    prefix: "e",
    qualifier: "unsharp_mask",
  },
  vectorize: {
    prefix: "e",
    qualifier: "vectorize",
  },
  vibrance: {
    prefix: "e",
    qualifier: "vibrance",
  },
  vignette: {
    prefix: "e",
    qualifier: "vignette",
  },
} as const satisfies { [k in keyof QualifierOptions]-?: QualifierConfig };
