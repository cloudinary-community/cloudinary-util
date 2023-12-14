import { z } from 'zod';

import { assetOptionsSchema, assetOptionsResizeSchema } from './asset';

// Fill Background

export const imageOptionsFillBackgroundSchema = z.object({
  crop: z.string().optional(),
  gravity: z.string().optional(),
  prompt: z.string().optional()
})

export type ImageOptionsFillBackground = z.infer<typeof imageOptionsFillBackgroundSchema>;

// Generative Replace

export const imageOptionsGenerativeReplaceSchema = z.object({
  to: z.string(),
  from: z.string(),
  preserveGeometry: z.boolean().optional()
})

export type ImageOptionsGenerativeReplace = z.infer<typeof imageOptionsGenerativeReplaceSchema>;

// Recolor

export const imageOptionsRecolorPromptSchema = z.union([
  z.string(),
  z.array(z.string())
])

export type ImageOptionsRecolorPrompt = z.infer<typeof imageOptionsRecolorPromptSchema>;

export const imageOptionsRecolorSchema = z.object({
  prompt: imageOptionsRecolorPromptSchema.optional(),
  to: z.string().optional(),
  multiple: z.boolean().optional(),
})

export type ImageOptionsRecolor = z.infer<typeof imageOptionsRecolorSchema>;

// Remove

export const imageOptionsRemovePromptSchema = z.union([
  z.string(),
  z.array(z.string())
]);

export type ImageOptionsRemovePrompt = z.infer<typeof imageOptionsRemovePromptSchema>;

export const imageOptionsRemoveRegionSchema = z.union([
  z.array(z.number()),
  z.array(z.array(z.number()))
]);

export type ImageOptionsRemoveRegion = z.infer<typeof imageOptionsRemoveRegionSchema>;

export const imageOptionsRemoveSchema = z.object({
  prompt: imageOptionsRemovePromptSchema.optional(),
  region: imageOptionsRemoveRegionSchema.optional(),
  multiple: z.boolean().optional(),
  removeShadow: z.boolean().optional()
})

export type ImageOptionsRemove = z.infer<typeof imageOptionsRemoveSchema>;

// Resize

export const imageOptionsResizeSchema = assetOptionsResizeSchema;

export type ImageOptionsResize = z.infer<typeof imageOptionsResizeSchema>;

// ZoomPan

export const imageOptionsZoomPanSchema = z.object({
  loop: z.union([ z.string(), z.boolean() ]),
  options: z.string()
})

export type ImageOptionsZoomPan = z.infer<typeof imageOptionsZoomPanSchema>;

// Image Options

export const imageOptionsSchema = assetOptionsSchema.extend({
  defaultImage: z.string()
    .describe(JSON.stringify({
      text: 'Configures the default image to use in case the given public ID is not available. Must include file extension.',
      url: 'https://cloudinary.com/documentation/transformation_reference#b_gen_fill'
    }))
    .optional(),
  fillBackground: z.union([
      z.boolean(),
      imageOptionsFillBackgroundSchema
    ])
    .describe(JSON.stringify({
      text: 'Uses Generative Fill to extended padded image with AI',
      url: 'https://cloudinary.com/documentation/transformation_reference#b_gen_fill'
    }))
    .optional(),
  recolor: z.union([
      imageOptionsRecolorPromptSchema,
      imageOptionsRecolorSchema
    ]).describe(JSON.stringify({
      text: 'Uses generative AI to recolor parts of your image, maintaining the relative shading.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_gen_recolor'
    }))
    .optional(),
  remove: z.union([
      imageOptionsRemovePromptSchema,
      imageOptionsRemoveSchema,
    ])
    .describe(JSON.stringify({
      text: 'Applies zooming and/or panning to an image, resulting in a video or animated image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_zoompan'
    }))
    .optional(),
  replace: z.union([
      z.array(z.string()),
      z.array(z.boolean()),
      imageOptionsGenerativeReplaceSchema
    ]).describe(JSON.stringify({
      text: 'Uses generative AI to recolor parts of your image, maintaining the relative shading.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_gen_replace'
    }))
    .optional(),
  restore: z.boolean()
    .describe(JSON.stringify({
      text: 'Uses generative AI to restore details in poor quality images or images that may have become degraded through repeated processing and compression.',
      url: 'https://cloudinary.com/documentation/transformation_reference#e_gen_restore'
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