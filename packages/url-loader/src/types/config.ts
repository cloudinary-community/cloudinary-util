import type { CloudinaryAssetConfiguration } from "@cloudinary-util/types";
import { z } from "zod";

export const configOptionsSchema: z.ZodType<CloudinaryAssetConfiguration> =
  z.any();

export type ConfigOptions = z.TypeOf<typeof configOptionsSchema>;
