import type { AssetOptions, AssetOptionsResize } from './asset';

export interface ImageOptionsFillBackground {
  crop?: string;
  gravity?: string;
  prompt?: string;
}

export interface ImageOptionsResize extends AssetOptionsResize {}

export interface ImageOptionsZoomPan {
  loop: string | boolean;
  options: string;
}

export interface ImageOptions extends AssetOptions {
  fillBackground?: boolean | ImageOptionsFillBackground;
  zoompan?: string | boolean | ImageOptionsZoomPan;
}
