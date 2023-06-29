import { z } from 'zod';

import { assetOptionsSchema } from './asset';

export const imageOptionsResizeSchema = assetOptionsSchema;

export type ImageOptionsResize = z.infer<typeof imageOptionsResizeSchema>;

export const imageOptionsZoomPanSchema = z.object({
  loop: z.union([ z.string(), z.boolean() ]),
  options: z.string()
})

export type ImageOptionsZoomPan = z.infer<typeof imageOptionsZoomPanSchema>;

export const imageOptionsSchema = assetOptionsSchema.extend({
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