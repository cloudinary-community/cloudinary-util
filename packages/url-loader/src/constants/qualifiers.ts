import { Qualifier } from '../types/qualifiers';
import { testColorIsHex, convertColorHexToRgb } from '@cloudinary-util/util';

const convertersColors = [
  {
    test: testColorIsHex,
    convert: convertColorHexToRgb
  }
]

export const primary: Record<string, Qualifier> = {
  aspectRatio: {
    qualifier: 'ar'
  },
  crop: {
    qualifier: 'c'
  },
  gravity: {
    qualifier: 'g'
  },
  height: {
    qualifier: 'h'
  },
  width: {
    qualifier: 'w'
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
  },
  autoBrightness: {
    prefix: 'e',
    qualifier: 'auto_brightness',
  },
  autoColor: {
    prefix: 'e',
    qualifier: 'auto_color',
  },
  autoContrast: {
    prefix: 'e',
    qualifier: 'auto_contrast',
  },
  assistColorblind: {
    prefix: 'e',
    qualifier: 'assist_colorblind',
  },
  background: {
    qualifier: 'b',
  },
  blackwhite: {
    prefix: 'e',
    qualifier: 'blackwhite',
  },
  blur: {
    prefix: 'e',
    qualifier: 'blur',
  },
  blurFaces: {
    prefix: 'e',
    qualifier: 'blur_faces',
  },
  blurRegion: {
    prefix: 'e',
    qualifier: 'blur_region',
  },
  border: {
    qualifier: 'bo',
  },
  brightness: {
    prefix: 'e',
    qualifier: 'brightness',
  },
  brightnessHSB: {
    prefix: 'e',
    qualifier: 'brightness_hsb',
  },
  cartoonify: {
    prefix: 'e',
    qualifier: 'cartoonify',
  },
  color: {
    qualifier: 'co',
    converters: convertersColors
  },
  colorize: {
    prefix: 'e',
    qualifier: 'colorize',
  },
  contrast: {
    prefix: 'e',
    qualifier: 'contrast',
  },
  distort: {
    prefix: 'e',
    qualifier: 'distort',
  },
  fillLight: {
    prefix: 'e',
    qualifier: 'fill_light',
  },
  gamma: {
    prefix: 'e',
    qualifier: 'gamma',
  },
  gradientFade: {
    prefix: 'e',
    qualifier: 'gradient_fade',
  },
  grayscale: {
    prefix: 'e',
    qualifier: 'grayscale',
  },
  improve: {
    prefix: 'e',
    qualifier: 'improve',
  },
  multiply: {
    prefix: 'e',
    qualifier: 'multiply',
  },
  negate: {
    prefix: 'e',
    qualifier: 'negate',
  },
  oilPaint: {
    prefix: 'e',
    qualifier: 'oil_paint',
  },
  opacity: {
    qualifier: 'o'
  },
  outline: {
    prefix: 'e',
    qualifier: 'outline',
  },
  overlay: {
    prefix: 'e',
    qualifier: 'overlay',
  },
  pixelate: {
    prefix: 'e',
    qualifier: 'pixelate',
  },
  pixelateFaces: {
    prefix: 'e',
    qualifier: 'pixelate_faces',
  },
  pixelateRegion: {
    prefix: 'e',
    qualifier: 'pixelate_region',
  },
  radius: {
    qualifier: 'r',
  },
  redeye: {
    prefix: 'e',
    qualifier: 'redeye',
  },
  replaceColor: {
    prefix: 'e',
    qualifier: 'replace_color',
  },
  saturation: {
    prefix: 'e',
    qualifier: 'saturation',
  },
  screen: {
    prefix: 'e',
    qualifier: 'screen',
  },
  sepia: {
    prefix: 'e',
    qualifier: 'sepia',
  },
  shadow: {
    prefix: 'e',
    qualifier: 'shadow',
  },
  sharpen: {
    prefix: 'e',
    qualifier: 'sharpen',
  },
  shear: {
    prefix: 'e',
    qualifier: 'shear',
  },
  simulateColorblind: {
    prefix: 'e',
    qualifier: 'simulate_colorblind',
  },
  tint: {
    prefix: 'e',
    qualifier: 'tint',
  },
  trim: {
    prefix: 'e',
    qualifier: 'trim',
  },
  unsharpMask: {
    prefix: 'e',
    qualifier: 'unsharp_mask',
  },
  vectorize: {
    prefix: 'e',
    qualifier: 'vectorize',
  },
  vibrance: {
    prefix: 'e',
    qualifier: 'vibrance',
  },
  vignette: {
    prefix: 'e',
    qualifier: 'vignette',
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

export const video: Record<string, Qualifier> = {
  streamingProfile: {
    qualifier: 'sp',
    location: 'primary'
  }
} as const;