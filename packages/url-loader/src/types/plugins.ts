import { z } from "zod";
import {
  aspectRatio,
  crop,
  format,
  gravity,
  height,
  width,
  x,
  y,
  zoom,
} from "../constants/parameters.js";

export const pluginOptionsSchema = z.object({
  aspectRatio: aspectRatio.schema.optional(),
  crop: crop.schema.optional(),
  gravity: gravity.schema.optional(),
  height: height.schema.optional(),
  format: format.schema.optional(),
  resize: z.string().optional(),
  x: x.schema.optional(),
  y: y.schema.optional(),
  width: width.schema.optional(),
  zoom: zoom.schema.optional(),
});

export type PluginOptions = z.infer<typeof pluginOptionsSchema>;

export interface PluginResults {
  options?: PluginOptions;
}
