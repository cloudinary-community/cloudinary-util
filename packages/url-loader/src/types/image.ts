import { z } from 'zod';

import { assetOptionsSchema } from './asset';

export const imageOptionsFillBackgroundSchema = z.object({
  crop: z.string().optional(),
  gravity: z.string().optional(),
  prompt: z.string().optional()
})

export type ImageOptionsFillBackground = z.infer<typeof imageOptionsFillBackgroundSchema>;

export const imageOptionsResizeSchema = assetOptionsSchema;

export type ImageOptionsResize = z.infer<typeof imageOptionsResizeSchema>;

export const imageOptionsZoomPanSchema = z.object({
  loop: z.union([ z.string(), z.boolean() ]),
  options: z.string()
})

export type ImageOptionsZoomPan = z.infer<typeof imageOptionsZoomPanSchema>;

// ImageOptionsFillBackground
export const imageOptionsSchema = assetOptionsSchema.extend({
  fillBackground: z.union([
      z.boolean(),
      imageOptionsFillBackgroundSchema
    ])
    .describe(JSON.stringify({
      text: 'Uses Generative Fill to extended padded image with AI',
      url: 'https://cloudinary.com/documentation/transformation_reference#b_gen_fill'
    }))
    .optional(),
  zoompan: z.union([
      z.string(),
      z.boolean(),
      imageOptionsZoomPanSchema
    ])
    .describe(JSON.stringify({
      text: 'Applies zooming and/or panning to an image, resulting in a video or animated image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_zoompan'
    }))
    .optional()
})

export type ImageOptions = z.infer<typeof imageOptionsSchema>;