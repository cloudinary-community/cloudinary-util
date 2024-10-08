import type { DefaultImage } from "../plugins/default-image.js";
import type { Enhance } from "../plugins/enhance.js";
import type { FillBackground } from "../plugins/fill-background.js";
import type { Recolor } from "../plugins/recolor.js";
import type { Remove } from "../plugins/remove.js";
import type { ReplaceBackground } from "../plugins/replace-background.js";
import type { Replace } from "../plugins/replace.js";
import type { Restore } from "../plugins/restore.js";
import type { Zoompan } from "../plugins/zoompan.js";
import type { AssetOptions } from "./asset.js";

export interface ImageOptions
  extends AssetOptions,
    DefaultImage.Options,
    Enhance.Options,
    FillBackground.Options,
    Recolor.Options,
    Remove.Options,
    Replace.Options,
    ReplaceBackground.Options,
    Restore.Options,
    Zoompan.Options {}
