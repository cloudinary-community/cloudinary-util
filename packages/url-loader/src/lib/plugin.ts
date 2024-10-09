import type { AssetOptions } from "../types/asset.js";
import type { ImageOptions } from "../types/image.js";
import type { PluginResults } from "../types/plugins.js";
import type { VideoOptions } from "../types/video.js";
import type { CldAsset } from "./cloudinary.js";

interface AllOptions extends AssetOptions, ImageOptions, VideoOptions {}

export type SupportedAssetKind = "image" | "video" | "all";

export type OptionName = keyof AllOptions;

export type ApplyWhen = OptionName | ((opts: AllOptions) => boolean);

export interface PluginDefinition<
  asset extends SupportedAssetKind,
  when extends ApplyWhen,
> {
  name: string;
  supports: asset;
  apply: PluginApplication<asset, when>;
  applyWhen?: when;
  strict?: boolean;
}

type OptionsFor<
  asset extends SupportedAssetKind,
  when extends ApplyWhen,
  options = asset extends "image"
    ? ImageOptions
    : asset extends "video"
      ? VideoOptions
      : AllOptions,
> = when extends keyof options
  ? // if the plugin applies based on a single key being defined, we know it will be
    // present in the options passed to apply
    options & { [k in when]: {} }
  : options;

export type PluginApplication<
  asset extends SupportedAssetKind,
  when extends ApplyWhen = never,
> = (cldAsset: CldAsset, options: OptionsFor<asset, when>) => PluginResults;

export type TransformationPlugin<
  asset extends SupportedAssetKind = SupportedAssetKind,
  when extends ApplyWhen = ApplyWhen,
> = Required<PluginDefinition<asset, when>>;

export const plugin = <
  asset extends SupportedAssetKind,
  when extends ApplyWhen,
>(
  def: PluginDefinition<asset, when>
): TransformationPlugin<asset, when> => ({ strict: false, ...def }) as never;
