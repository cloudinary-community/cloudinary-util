import { AssetOptions } from './asset';
import { ImageOptions } from './image';
import { VideoOptions } from './video';

export interface PluginSettings {
  cldAsset: any;
  options: AssetOptions | ImageOptions | VideoOptions;
}

export interface PluginOverrides {
  format?: string;
  width?: number;
}