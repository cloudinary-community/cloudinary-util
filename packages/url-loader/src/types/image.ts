import type { AssetOptions, AssetOptionsResize } from './asset';

export interface ImageOptionsResize extends AssetOptionsResize {}

export interface ImageOptionsZoomPan {
  loop: string | boolean;
  options: string;
}

export interface ImageOptions extends AssetOptions {
  zoompan?: string | boolean | ImageOptionsZoomPan;
}
