import type { SupportedAssetType } from "../lib/plugin.js";
import type { AbrPlugin } from "../plugins/abr.js";
import type { CroppingPlugin } from "../plugins/cropping.js";
import type { DefaultImage } from "../plugins/default-image.js";
import type { EffectsPlugin } from "../plugins/effects.js";
import type { EnhancePlugin } from "../plugins/enhance.js";
import type { ExtractPlugin } from "../plugins/extract.js";
import type { FillBackgroundPlugin } from "../plugins/fill-background.js";
import type { FlagsPlugin } from "../plugins/flags.js";
import type { NamedTransformationsPlugin } from "../plugins/named-transformations.js";
import type { OverlaysPlugin } from "../plugins/overlays.js";
import type { PreserveTransformationsPlugin } from "../plugins/preserve-transformations.js";
import type { RawTransformationsPlugin } from "../plugins/raw-transformations.js";
import type { RecolorPlugin } from "../plugins/recolor.js";
import type { RemoveBackgroundPlugin } from "../plugins/remove-background.js";
import type { RemovePlugin } from "../plugins/remove.js";
import type { ReplaceBackgroundPlugin } from "../plugins/replace-background.js";
import type { ReplacePlugin } from "../plugins/replace.js";
import type { RestorePlugin } from "../plugins/restore.js";
import type { SanitizePlugin } from "../plugins/sanitize.js";
import type { SeoPlugin } from "../plugins/seo.js";
import type { UnderlaysPlugin } from "../plugins/underlays.js";
import type { VersionPlugin } from "../plugins/version.js";
import type { ZoompanPlugin } from "../plugins/zoompan.js";

export type SupportedAssetTypeInput = SupportedAssetType | "videos" | "images";

export type OptionsByPluginName = {
  Abr: AbrPlugin.Options;
  Cropping: CroppingPlugin.Options;
  DefaultImage: DefaultImage.Options;
  Effects: EffectsPlugin.Options;
  Enhance: EnhancePlugin.Options;
  Extract: ExtractPlugin.Options;
  FillBackground: FillBackgroundPlugin.Options;
  Flags: FlagsPlugin.Options;
  NamedTransformations: NamedTransformationsPlugin.Options;
  Overlays: OverlaysPlugin.Options;
  PreserveTransformations: PreserveTransformationsPlugin.Options;
  RawTransformations: RawTransformationsPlugin.Options;
  Recolor: RecolorPlugin.Options;
  RemoveBackground: RemoveBackgroundPlugin.Options;
  Remove: RemovePlugin.Options;
  ReplaceBackground: ReplaceBackgroundPlugin.Options;
  Replace: ReplacePlugin.Options;
  Restore: RestorePlugin.Options;
  Sanitize: SanitizePlugin.Options;
  Seo: SeoPlugin.Options;
  Underlays: UnderlaysPlugin.Options;
  Version: VersionPlugin.Options;
  Zoompan: ZoompanPlugin.Options;
};

export interface BaseAssetOptions<
  assetType extends SupportedAssetTypeInput = SupportedAssetTypeInput,
> {
  /**
   * @description Cloudinary Public ID or versioned Cloudinary URL (/v1234/)
   */
  src: string;
  /**
   * @description The type of asset to deliver.
   * @url https://cloudinary.com/documentation/image_transformations#transformation_url_structure
   */
  assetType?: assetType;
  /**
   * @description Delivery method of the asset.
   * @url https://cloudinary.com/documentation/image_transformations#delivery_types
   */
  deliveryType?: string;
  /**
   * @description Delivery method of the asset.
   * @url https://cloudinary.com/documentation/image_transformations#delivery_types
   */
  dpr?: string | number;
  /**
   * @description Converts (if necessary) and delivers an asset in the specified format.
   * @url https://cloudinary.com/documentation/transformation_reference#f_format
   */
  format?: string;
  /**
   * @description Height of the given asset.
   */
  height?: string | number;
  /**
   * @description Quality of the delivered asset
   * @url https://cloudinary.com/documentation/transformation_reference#q_quality
   */
  quality?: string | number | string;
  /**
   * @description Gives you the ability to have more control over what transformations are permitted to be used from your Cloudinary account.
   * @url https://cloudinary.com/documentation/control_access_to_media#strict_transformations
   */
  strictTransformations?: boolean;
  /**
   * @description Width of the given asset.
   */
  width?: string | number;
}

export interface AssetOptions<
  assetType extends SupportedAssetTypeInput = SupportedAssetTypeInput,
> extends BaseAssetOptions<assetType>,
    CroppingPlugin.Options,
    EffectsPlugin.Options,
    FlagsPlugin.Options,
    NamedTransformationsPlugin.Options,
    OverlaysPlugin.Options,
    PreserveTransformationsPlugin.Options,
    RawTransformationsPlugin.Options,
    RemoveBackgroundPlugin.Options,
    SanitizePlugin.Options,
    SeoPlugin.Options,
    UnderlaysPlugin.Options,
    VersionPlugin.Options,
    ZoompanPlugin.Options {}
