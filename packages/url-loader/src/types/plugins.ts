import { z } from 'zod';
import { aspectRatio, crop, gravity, height, format, width, zoom } from '../constants/parameters';
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


export const pluginOptionsSchema = z.object({
  aspectRatio: aspectRatio.schema.optional(),
  crop: crop.schema.optional(),
  gravity: gravity.schema.optional(),
  height: height.schema.optional(),
  format: format.schema.optional(),
  resize: z.string().optional(),
  width: width.schema.optional(),
  zoom: zoom.schema.optional(),
})

export type PluginOptions = z.infer<typeof pluginOptionsSchema>;

export interface PluginResults {
  options?: PluginOptions;
}