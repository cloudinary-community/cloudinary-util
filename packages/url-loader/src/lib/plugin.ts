import type { AssetOptions, SupportedAssetTypeInput } from "../types/asset.js";
import type { ImageOptions } from "../types/image.js";
import type { PluginResults } from "../types/plugins.js";
import type { VideoOptions } from "../types/video.js";
import type { CldAsset } from "./cloudinary.js";

export interface AllOptions extends AssetOptions, ImageOptions, VideoOptions {}

export type CloudinaryKey = keyof AllOptions & {};

export type SupportedAssetType = "image" | "video" | "all";

export type OptionName = keyof AllOptions;

export type ApplyWhen = OptionName | ((opts: AllOptions) => boolean);

export type AlwaysApply = () => true;

export interface PluginDefinition<
  assetType extends SupportedAssetType,
  name extends string,
  options extends object,
  alwaysApply extends boolean,
> {
  name: name;
  supports: assetType;
  apply: PluginApplicationDefinition<assetType, options, alwaysApply>;
  inferOwnOptions: options;
  props: Record<keyof options, true>;
  alwaysApply?: alwaysApply;
  strict?: boolean;
}

export interface TransformationPlugin<
  assetType extends SupportedAssetType = SupportedAssetType,
  name extends string = string,
  opts extends object = object,
  alwaysApply extends boolean = boolean,
> {
  name: name;
  supports: assetType;
  apply: PluginApplication<assetType, opts, alwaysApply>;
  inferOwnOptions: opts;
  props: Record<keyof opts, true>;
  alwaysApply: alwaysApply;
  strict?: boolean;
}

export type OwnOptionsParam<
  opts extends object,
  alwaysApply extends boolean,
> = opts &
  // if there's only one owned key, we know it must be present if
  // apply is being invoked, so require it so we don't have to recheck
  // in the implementation unless alwaysApply is true
  ([alwaysApply] extends [true]
    ? {}
    : { [k in singleKeyOf<opts>]: Exclude<opts[k], undefined> });

export type CtxParam<assetType extends SupportedAssetTypeInput> =
  assetType extends "all"
    ? AllOptions
    : assetType extends "video" | "videos"
      ? VideoOptions
      : ImageOptions;

// extract the key if there is exactly one, otherwise never
type singleKeyOf<opts> = {
  [k in keyof opts]: keyof opts extends k ? k : never;
}[keyof opts];

export type PluginApplicationDefinition<
  assetType extends SupportedAssetType,
  opts extends object,
  alwaysApply extends boolean,
> = (
  cldAsset: CldAsset,
  /** Options owned by this plugin */
  opts: OwnOptionsParam<opts, alwaysApply>,
  ctx: CtxParam<assetType>,
) => PluginResults;

export type PluginApplication<
  assetType extends SupportedAssetType,
  opts extends object,
  alwaysApply extends boolean,
> = (
  cldAsset: CldAsset,
  // externally, we want the wider assetType options as well
  opts: OwnOptionsParam<opts, alwaysApply> & CtxParam<assetType>,
) => PluginResults;

export const plugin = <
  asset extends SupportedAssetType,
  name extends string,
  opts extends object,
  alwaysApply extends boolean,
>(
  def: PluginDefinition<asset, name, opts, alwaysApply>,
): TransformationPlugin<asset, name, opts, alwaysApply> =>
  ({
    strict: false,
    alwaysApply: false,
    ...def,
    apply: (cldAsset, ctx) => def.apply(cldAsset, ctx as never, ctx as never),
  }) satisfies TransformationPlugin as never;
