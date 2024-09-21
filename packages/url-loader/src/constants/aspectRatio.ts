import { z } from "zod";

export const aspectRatioModesEnum = z.enum([
  "vflip",
  "hflip",
  "ignore",
  "auto_right",
  "auto_left",
]);

const _aspectRatioSchema = z.union([
  z.number(),
  aspectRatioModesEnum,
  z.intersection(z.string(), z.object({})), // Quirk to allow enum + string
]);

const { _output } = _aspectRatioSchema;

export type AspectRatio = typeof _output;

export const aspectRatioSchema: z.ZodType<AspectRatio> = _aspectRatioSchema;

export const aspectRatio = {
  qualifier: "ar",
  schema: aspectRatioSchema.describe(
    JSON.stringify({
      text: "Crops or resizes the asset to a new aspect ratio.",
      url: "https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio",
    }),
  ),
};
