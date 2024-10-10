import type { AbrPlugin } from "../plugins/abr.js";
import type { AssetOptions } from "./asset.js";

export interface VideoOptions extends AssetOptions, AbrPlugin.Options {}
