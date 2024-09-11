import type { CloudinaryAssetConfiguration } from "@cloudinary-util/types";
import { z } from "zod";
import type { Preserve } from "../lib/utils.js";

export interface CloudinaryConfigurationOptions
  extends CloudinaryAssetConfiguration {}

export const configOptionsSchema: z.ZodType<CloudinaryConfigurationOptions> =
  z.any();

const { _output } = configOptionsSchema;

export interface ConfigOptions extends Preserve<typeof _output> {}
