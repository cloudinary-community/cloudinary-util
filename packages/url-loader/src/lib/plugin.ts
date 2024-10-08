import type { AssetOptions } from "../types/asset.js";
import type { ImageOptions } from "../types/image.js";
import type { PluginResults } from "../types/plugins.js";
import type { VideoOptions } from "../types/video.js";
import type { CldAsset } from "./cloudinary.js";

interface AllOptions extends AssetOptions, ImageOptions, VideoOptions {}

export type AssetType = "image" | "images" | "video" | "videos";

export type OptionName = keyof AllOptions;

export type ApplyWhen = OptionName | ((opts: AllOptions) => boolean);

export interface PluginDefinition<
  asset extends AssetType,
  when extends ApplyWhen,
> {
  assetTypes: Array<AssetType>;
  assetType?: AssetType;
  apply: PluginApplication<asset, when>;
  applyWhen?: when;
  strict?: boolean;
}

export type OptionsFor<when extends ApplyWhen> = when extends keyof AllOptions
  ? AllOptions extends when
    ? // do nothing if it wasn't inferred and fell back to the base constraint
      AllOptions
    : // if the plugin applies based on a single key being defined, we know it will be
      // present in the options passed to apply
      AllOptions & { [k in when]: {} }
  : AllOptions;

export type PluginApplication<
  asset extends AssetType,
  when extends ApplyWhen,
> = (cldAsset: CldAsset, options: OptionsFor<when>) => PluginResults;

export type Plugin<asset extends AssetType, when extends ApplyWhen> = Required<
  PluginDefinition<asset, when>
>;

export const plugin = <asset extends AssetType, when extends ApplyWhen>(
  def: PluginDefinition<asset, when>
): Plugin<asset, when> => ({ strict: false, ...def }) as never;
