import type { AssetOptions, AssetOptionsResize } from "./asset";

export interface ImageOptionsFillBackground {
  crop?: string;
  gravity?: string;
  prompt?: string;
}

export interface ImageOptionsResize extends AssetOptionsResize {}

export interface ImageOptionsGenerativeReplace {
  to: string;
  from: string;
  preserveGeometry?: boolean;
}

export interface ImageOptionsZoomPan {
  loop: string | boolean;
  options: string;
}

export interface ImageOptions extends AssetOptions {
  fillBackground?: boolean | ImageOptionsFillBackground;
  replace?: Array<string | boolean> | ImageOptionsGenerativeReplace;
  zoompan?: string | boolean | ImageOptionsZoomPan;
}
