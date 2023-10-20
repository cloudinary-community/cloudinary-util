import { AssetOptions } from './asset';
import { ImageOptions } from './image';
import { VideoOptions } from './video';

type AllOptions = AssetOptions | ImageOptions | VideoOptions;

export interface PluginSettings<Options extends AllOptions = AllOptions> {
  cldAsset: any;
  options: Options;
}

export interface PluginOverrides {
  format?: string;
  width?: number;
}