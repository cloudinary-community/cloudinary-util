import { AssetOptions } from './asset';
import { ImageOptions } from './image';
import { VideoOptions } from './video';

type AllOptions = AssetOptions | ImageOptions | VideoOptions;

export interface PluginSettings<Options extends AllOptions = AllOptions> {
  cldAsset: any;
  options: Options;
}

export interface TransformationPlugin {
  assetTypes: Array<string>;
  plugin: Function;
  strict?: boolean;
  props: object;
}

export interface PluginOptions {
  aspectRatio?: string | number;
  crop?: string;
  gravity?: string;
  height?: number;
  format?: string;
  width?: string | number;
  zoom?: string;
}

export interface PluginResults {
  options?: PluginOptions;
  resize?: string;
}