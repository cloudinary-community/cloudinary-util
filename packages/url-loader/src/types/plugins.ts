import type {
  AspectRatio,
  CropMode,
  Format,
  Gravity,
  Height,
  Width,
  X,
  Y,
  Zoom,
} from "../constants/parameters.js";

export interface PluginOptions {
  aspectRatio?: AspectRatio;
  crop?: CropMode;
  gravity?: Gravity;
  height?: Height;
  format?: Format;
  resize?: string;
  x?: X;
  y?: Y;
  width?: Width;
  zoom?: Zoom;
}

export interface PluginResults {
  options?: PluginOptions;
}
