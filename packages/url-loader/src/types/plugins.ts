import { ImageOptions } from './image';

export interface PluginSettings {
  cldImage: any;
  options: ImageOptions;
}

export interface PluginOverrides {
  format?: string;
  width?: number;
}