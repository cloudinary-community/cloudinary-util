import type { CloudinaryAssetConfiguration } from "@cloudinary-util/types";
import { objectHasKey, parseUrl, type ParseUrl } from "@cloudinary-util/util";
import {
  Cloudinary,
  type CloudinaryImage,
  type CloudinaryVideo,
} from "@cloudinary/url-gen";
import type { IAnalyticsOptions } from "@cloudinary/url-gen/sdkAnalytics/interfaces/IAnalyticsOptions";

import { AbrPlugin } from "../plugins/abr.js";
import { DefaultImage } from "../plugins/default-image.js";
import { EffectsPlugin } from "../plugins/effects.js";
import { FillBackgroundPlugin } from "../plugins/fill-background.js";
import { FlagsPlugin } from "../plugins/flags.js";
import { PreserveTransformationsPlugin } from "../plugins/preserve-transformations.js";
import { RawTransformationsPlugin } from "../plugins/raw-transformations.js";
import { RecolorPlugin } from "../plugins/recolor.js";
import { RemoveBackgroundPlugin } from "../plugins/remove-background.js";
import { RemovePlugin } from "../plugins/remove.js";
import { ReplaceBackgroundPlugin } from "../plugins/replace-background.js";
import { ReplacePlugin } from "../plugins/replace.js";
import { RestorePlugin } from "../plugins/restore.js";
import { SanitizePlugin } from "../plugins/sanitize.js";
import { SeoPlugin } from "../plugins/seo.js";
import { UnderlaysPlugin } from "../plugins/underlays.js";
import { ZoompanPlugin } from "../plugins/zoompan.js";

import { CroppingPlugin } from "../plugins/cropping.js";
import { EnhancePlugin } from "../plugins/enhance.js";
import { ExtractPlugin } from "../plugins/extract.js";
import { NamedTransformationsPlugin } from "../plugins/named-transformations.js";
import { OverlaysPlugin } from "../plugins/overlays.js";
import { VersionPlugin } from "../plugins/version.js";
import type {
  BaseAssetOptions,
  OptionsByPluginName,
  SupportedAssetTypeInput,
} from "../types/asset.js";
import type { ImageOptions } from "../types/image.js";
import type { PluginOptions, PluginResults } from "../types/plugins.js";
import type { VideoOptions } from "../types/video.js";
import type { OptionsFor, TransformationPlugin } from "./plugin.js";
import { entriesOf, throwError } from "./utils.js";

const validatePlugins = <const plugins extends readonly TransformationPlugin[]>(
  ...plugins: plugins extends validatePlugins<plugins>
    ? plugins
    : validatePlugins<plugins>
) => plugins;

export const transformationPlugins = validatePlugins(
  // Some features *must* be the first transformation applied
  // thus their plugins *must* come first in the chain

  EnhancePlugin,
  ExtractPlugin,
  RecolorPlugin,
  RemoveBackgroundPlugin,
  RemovePlugin,
  ReplacePlugin,
  ReplaceBackgroundPlugin,
  RestorePlugin,

  // Cropping needs to be before any other general transformations
  // as it provides the option of 2-step resizing where someone
  // can resize the "base" canvas as well as the final resize
  // mechanism commonly used for responsive resizing
  CroppingPlugin,

  // Raw transformations should always come before
  // other arguments to avoid conflicting with
  // added options via the component

  PreserveTransformationsPlugin,
  RawTransformationsPlugin,

  AbrPlugin,
  DefaultImage,
  EffectsPlugin,
  FillBackgroundPlugin,
  FlagsPlugin,
  OverlaysPlugin,
  SanitizePlugin,
  NamedTransformationsPlugin,
  SeoPlugin,
  UnderlaysPlugin,
  VersionPlugin,
  ZoompanPlugin
);

export interface AnalyticsOptions extends IAnalyticsOptions {}

export interface ConfigOptions extends CloudinaryAssetConfiguration {}

/**
 * @description Asset options (Image or Video) that define delivery URL including public ID and transformations.
 * @path /url-loader/assetoptions
 */
export type OptionsInput = ImageOptions | VideoOptions;

/**
 * constructCloudinaryUrl
 * @description Builds a full Cloudinary URL using transformation plugins specified by options
 */

export interface ConstructUrlProps<
  assetType extends SupportedAssetTypeInput = SupportedAssetTypeInput,
> {
  /**
   * @description Tech, dependency, and feature identifiers for tracking SDK usage related to Cloudinary.
   * @path /url-loader/analyticsoptions
   */
  analytics?: AnalyticsOptions | boolean;
  /**
   * @description Configuration parameters for environment and Cloudinary account.
   * @url https://cloudinary.com/documentation/cloudinary_sdks#configuration_parameters
   * @path /url-loader/analyticsoptions
   */
  config?: ConfigOptions;
  // prioritize inferring assetType so available options can be derived from it
  options: { assetType?: assetType } & OptionsFor<assetType>;
}

export type CldAsset = CloudinaryImage | CloudinaryVideo;

export function constructCloudinaryUrl<
  // only suggest options applicable to the current
  // assetType (defaulting to image)
  assetType extends SupportedAssetTypeInput = "image",
>({ options, config = {}, analytics }: ConstructUrlProps<assetType>): string {
  // If someone is explicitly passing in undefined for analytics via the analytics option,
  // ensure that the URL Gen SDK option is being passed in as false as well

  if (analytics === false) {
    if (typeof config?.url === "undefined") {
      config.url = {};
    }
    config.url.analytics = false;
  }

  const cld = new Cloudinary(config);

  if (typeof options?.src !== "string") {
    throw Error(
      `Failed to construct Cloudinary URL: Missing source (src) in options.`
    );
  }

  if (!options?.assetType) {
    options.assetType = "image" as never;
  }

  const parsedOptions = {} as Pick<ParseUrl, "seoSuffix" | "version">;

  let publicId;

  // If the src starts with https, try to parse the URL to grab the ID dynamically
  // otherwise fall back to the src which should be a public ID or a remote URL
  // which will work when using the delivery type of fetch

  if (typeof options.src === "string" && /^https?:\/\//.test(options.src)) {
    try {
      const parts = parseUrl(options.src);
      publicId = parts?.publicId;
      parsedOptions.seoSuffix = parts?.seoSuffix;
      parsedOptions.version = parts?.version;
    } catch (e) {
      // ignore
    }
  }

  if (!publicId) {
    publicId = options.src;
  }

  // Take all the parsed URL parts and apply them to the options configuration
  // if there isn't an existing override

  entriesOf(parsedOptions).forEach(([key, value]) => {
    if (objectHasKey(options, key)) return;
    options[key] = value as never;
  });

  options.version ??= 1;

  // Begin creating a new Cloudinary image instance and configure

  const normalizedAssetType =
    options.assetType === "image" || options.assetType === "images"
      ? "image"
      : options.assetType === "video" || options.assetType === "videos"
        ? "video"
        : throwError(`${options.assetType} is not a valid assetType`);

  const cldAsset = cld[normalizedAssetType](publicId);

  const pluginEffects: PluginOptions = {};

  transformationPlugins.forEach(
    ({ name, apply, strict, applyWhen, supports }: TransformationPlugin) => {
      const shouldApply =
        applyWhen === undefined ||
        (typeof applyWhen === "string"
          ? options[applyWhen as never] !== undefined
          : applyWhen(options));

      if (!shouldApply) return;

      if (normalizedAssetType !== supports && supports !== "all") {
        console.warn(
          `${name} does not support assetType ${normalizedAssetType}`
        );
        return;
      }

      if (options.strictTransformations && !strict) {
        console.warn(`${name} does not support Strict Transformations.`);
        return;
      }

      const results: PluginResults = apply(cldAsset, options);

      const pluginOptions = results?.options ?? {};

      Object.assign(pluginEffects, pluginOptions);
    }
  );

  // We want to perform any resizing at the end of the end of the transformation
  // sets to allow consistent use of positioning / sizing, especially responsively

  if (typeof pluginEffects.resize === "string") {
    cldAsset.addTransformation(pluginEffects.resize);
  }

  cldAsset.setDeliveryType(options?.deliveryType || "upload");

  // Strict transformations requires opt-in for any transformation. If this is
  // enabled, nothing should be added on top of the URL

  if (!options.strictTransformations) {
    if (options?.dpr) {
      let dpr = options.dpr;
      if (typeof dpr === "number") {
        dpr = dpr.toFixed(1);
      }
      cldAsset.addTransformation(`dpr_${dpr}`);
    }

    // An enhancement to our delivery URL is to automatically opt into optimization
    // including both the most efficient format and automatic compression. However,
    // we want to be able to give someone the ability to opt out (default) or if
    // we already detect a format or quality in the URL, such as consuming an
    // existing Cloudianry URL as the source, we don't want to double apply it
    // which can cause conflicts with the previous asset

    const defaultFormat = options?.format === "default";
    const rawContainsFormat = searchAssetRawTransformations("f_", cldAsset, {
      matchType: "startsWith",
    });
    const rawContainsFormatAndExplicit =
      rawContainsFormat && typeof options?.format !== "undefined";

    if (
      pluginEffects?.format ||
      (!defaultFormat && (!rawContainsFormat || rawContainsFormatAndExplicit))
    ) {
      cldAsset.format(options?.format || pluginEffects?.format || "auto");
    }

    const defaultQuality = options?.quality === "default";
    const rawContainsQuality = searchAssetRawTransformations("q_", cldAsset, {
      matchType: "startsWith",
    });
    const rawContainsQualityAndExplicit =
      rawContainsQuality && typeof options?.quality !== "undefined";

    if (
      !defaultQuality &&
      (!rawContainsQuality || rawContainsQualityAndExplicit)
    ) {
      cldAsset.quality(options?.quality || "auto");
    }
  }

  return cldAsset.toURL({
    trackedAnalytics: typeof analytics === "object" ? analytics : undefined,
  });
}

/**
 * searchAssetRawTransformations
 * @description Given a CloudinaryImage or CloudinaryVideo, searches raw transformations applied to the instance
 */

interface SearchAssetRawTransformationsOptions {
  matchType: string;
}

export function searchAssetRawTransformations(
  query: string,
  asset: CloudinaryImage | CloudinaryVideo,
  options?: SearchAssetRawTransformationsOptions
) {
  if (typeof asset.transformation === "undefined") return;

  const { matchType = "includes" } = options || {};

  const transformations = asset.transformation.actions.flatMap(
    (transformation) => {
      // Raw transformations can come in different shapes and sizes including
      // `['f_auto/q_auto']` or `['f_auto','q_auto']` so attempt to handle both
      return transformation
        .toString()
        .split("/")
        .flatMap((seg) => seg.split(","));
    }
  );

  const matches = transformations.filter((transformation) => {
    if (matchType === "startsWith") {
      return transformation.startsWith(query);
    } else {
      return transformation.includes(query);
    }
  });

  return matches.length > 0;
}

type validatePlugins<
  remaining extends ReadonlyArray<TransformationPlugin>,
  validated extends ReadonlyArray<unknown> = [],
  // initialize opts to the BaseAssetOptions so that if any of those keys are duplicated,
  // we'll know right away
  opts = BaseAssetOptions,
> = remaining extends readonly [
  infer next extends TransformationPlugin,
  ...infer rest extends ReadonlyArray<TransformationPlugin>,
]
  ? next["name"] extends keyof OptionsByPluginName
    ? validatePlugins<
        rest,
        [
          ...validated,
          keyof opts & keyof OptionsByPluginName[next["name"]] extends never
            ? // if the intersection is never, no options duplicate existing so the plugin is valid
              next
            : {
                duplicatePropertiesMustBeRemoved: keyof opts &
                  keyof OptionsByPluginName[next["name"]];
              },
        ],
        opts & OptionsByPluginName[next["name"]]
      >
    : validatePlugins<
        rest,
        [...validated, `${next["name"]} must be added to OptionsByPluginName`],
        opts
      >
  : validated;
