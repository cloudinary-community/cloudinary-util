import type { AssetOptions, SupportedAssetTypeInput } from "../types/asset.js";
import type { ImageOptions } from "../types/image.js";
import type { PluginResults } from "../types/plugins.js";
import type { VideoOptions } from "../types/video.js";
import type { CldAsset } from "./cloudinary.js";

interface AllOptions extends AssetOptions, ImageOptions, VideoOptions {}

export type SupportedAssetType = "image" | "video" | "all";

export type OptionName = keyof AllOptions;

export type ApplyWhen = OptionName | ((opts: AllOptions) => boolean);

export type AlwaysApply = () => true;

export interface PluginDefinition<
  assetType extends SupportedAssetType,
  when extends ApplyWhen,
  name extends string,
  options extends object,
> {
  name: name;
  supports: assetType;
  apply: PluginApplication<assetType, when>;
  inferOwnOptions: options;
  applyWhen?: when | undefined;
  strict?: boolean;
}

export interface TransformationPlugin<
  assetType extends SupportedAssetType = SupportedAssetType,
  when extends ApplyWhen = ApplyWhen,
  name extends string = string,
  options extends object = object,
> {
  name: name;
  supports: assetType;
  apply: PluginApplication<assetType, when>;
  inferOwnOptions: options;
  applyWhen?: when | undefined;
  strict?: boolean;
}

export type OptionsFor<
  assetType extends SupportedAssetTypeInput,
  when extends ApplyWhen = AlwaysApply,
  options = assetType extends "all"
    ? AllOptions
    : assetType extends "video" | "videos"
      ? VideoOptions
      : ImageOptions,
> = [when] extends [keyof options]
  ? // if the plugin applies based on a single key being defined, we know it will be
    // present in the options passed to apply
    options & { [k in when]: {} }
  : options;

export type PluginApplication<
  assetType extends SupportedAssetType,
  when extends ApplyWhen = AlwaysApply,
> = (cldAsset: CldAsset, options: OptionsFor<assetType, when>) => PluginResults;

export const plugin = <
  asset extends SupportedAssetType,
  when extends ApplyWhen,
  name extends string,
  options extends object,
>(
  def: PluginDefinition<asset, when, name, options>
): TransformationPlugin<asset, when, name, options> =>
  ({ strict: false, ...def }) as never;
