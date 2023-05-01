import { ImageOptions } from './image';

export interface PluginSettings {
  cldAsset: any;
  options: ImageOptions;
}

export interface PluginOverrides {
  format?: string;
  width?: number;
}