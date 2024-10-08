import type { DefaultImage } from "../plugins/default-image.js";
import type { EnhancePlugin } from "../plugins/enhance.js";
import type { ExtractPlugin } from "../plugins/extract.js";
import type { FillBackgroundPlugin } from "../plugins/fill-background.js";
import type { RecolorPlugin } from "../plugins/recolor.js";
import type { RemovePlugin } from "../plugins/remove.js";
import type { ReplaceBackground } from "../plugins/replace-background.js";
import type { ReplacePlugin } from "../plugins/replace.js";
import type { RestorePlugin } from "../plugins/restore.js";
import type { ZoompanPlugin } from "../plugins/zoompan.js";
import type { AssetOptions } from "./asset.js";

export interface ImageOptions
  extends AssetOptions,
    DefaultImage.Options,
    EnhancePlugin.Options,
    ExtractPlugin.Options,
    FillBackgroundPlugin.Options,
    RecolorPlugin.Options,
    RemovePlugin.Options,
    ReplacePlugin.Options,
    ReplaceBackground.Options,
    RestorePlugin.Options,
    ZoompanPlugin.Options {}
