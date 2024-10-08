import type { AssetOptions } from "../types/asset.js";
import type { ImageOptions } from "../types/image.js";
import type { PluginResults } from "../types/plugins.js";
import type { VideoOptions } from "../types/video.js";
import type { CldAsset } from "./cloudinary.js";

interface AllOptions extends AssetOptions, ImageOptions, VideoOptions {}

export type AssetType = "image" | "images" | "video" | "videos";

export type OptionName = keyof AllOptions;

export type ApplyWhen = OptionName | ((opts: AllOptions) => boolean);

export interface PluginDefinition<When extends ApplyWhen = ApplyWhen> {
  assetTypes: Array<AssetType>;
  apply: PluginApplication;
  applyWhen?: When;
  strict?: boolean;
}

const name: OptionName = "";

export type OptionsFor<When extends ApplyWhen> = When extends keyof AllOptions
  ? // if the plugin applies based on a single key being defined, we know it will be
    // present in the options passed to apply
    AllOptions & { [k in When]: {} }
  : AllOptions;

export type PluginApplication<When extends ApplyWhen = ApplyWhen> = (
  cldAsset: CldAsset,
  options: OptionsFor<When>
) => PluginResults;

export type Plugin<When extends ApplyWhen = ApplyWhen> = Required<
  PluginDefinition<When>
>;

export const plugin = <When extends ApplyWhen>(
  def: PluginDefinition<When>
): Plugin<When> => ({ strict: false, ...def });
