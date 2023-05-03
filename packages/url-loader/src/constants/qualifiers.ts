import { Qualifier } from '../types/qualifiers';
import { testColorIsHex, convertColorHexToRgb } from '../lib/colors';

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
  relative: {
    prefix: 'fl',
    qualifier: 'relative',
    location: 'primary'
  }
} as const;

export const video: Record<string, Qualifier> = {
  streamingProfile: {
    qualifier: 'sp',
    location: 'primary'
  }
} as const;