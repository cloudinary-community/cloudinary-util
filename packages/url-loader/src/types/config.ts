import type { CloudinaryAssetConfiguration } from "@cloudinary-util/types";
import { z } from "zod";

export interface CloudinaryConfigurationOptions extends CloudinaryAssetConfiguration {}

export const configOptionsSchema: z.ZodType<CloudinaryConfigurationOptions> =
  z.any();

export type ConfigOptions = z.TypeOf<typeof configOptionsSchema>;