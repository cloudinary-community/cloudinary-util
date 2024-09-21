import { z } from "zod";

const _cropModesSchema = z.enum([
  "auto",
  "fill",
  "lfill",
  "fill_pad",
  "crop",
  "thumb",
  "scale",
  "fit",
  "limit",
  "mfit",
  "pad",
  "lpad",
  "mpad",
  "imagga_scale",
  "imagga_crop",
]);

const { _output } = _cropModesSchema;

export type CropMode = typeof _output;

const cropModesSchema: z.ZodType<CropMode> = _cropModesSchema;

export const crop = {
  qualifier: "c",
  schema: cropModesSchema.describe(
    JSON.stringify({
      text: "Mode to use when cropping an asset.",
      url: "https://cloudinary.com/documentation/transformation_reference#c_crop_resize",
    }),
  ),
};
