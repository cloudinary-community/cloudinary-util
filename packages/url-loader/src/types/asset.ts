import type { SupportedAssetType } from "../lib/plugin.js";
import type { CroppingPlugin } from "../plugins/cropping.js";
import type { EffectsPlugin } from "../plugins/effects.js";
import type { FlagsPlugin } from "../plugins/flags.js";
import type { NamedTransformationsPlugin } from "../plugins/named-transformations.js";
import type { OverlaysPlugin } from "../plugins/overlays.js";
import type { PreserveTransformationsPlugin } from "../plugins/preserve-transformations.js";
import type { RawTransformationsPlugin } from "../plugins/raw-transformations.js";
import type { RemoveBackgroundPlugin } from "../plugins/remove-background.js";
import type { SanitizePlugin } from "../plugins/sanitize.js";
import type { SeoPlugin } from "../plugins/seo.js";
import type { UnderlaysPlugin } from "../plugins/underlays.js";
import type { VersionPlugin } from "../plugins/version.js";
import type { ZoompanPlugin } from "../plugins/zoompan.js";

import type { Format } from "../constants/parameters.js";

export type SupportedAssetTypeInput = SupportedAssetType | "videos" | "images";

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
  format?: Format;
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
