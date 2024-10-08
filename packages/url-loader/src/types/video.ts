import type { Abr } from "../plugins/abr.js";
import type { AssetOptions } from "./asset.js";

export interface VideoOptions extends AssetOptions, Abr.Options {}
