import { z } from 'zod';

export const assetOptionsResizeSchema = z.object({
  crop: z.string().optional(),
  width: z.union([
    z.number(),
    z.string()
  ]).optional()
})

export type AssetOptionsResize = z.infer<typeof assetOptionsResizeSchema>;

export const assetOptionsSchema = z.object({
  assetType: z.string()
    .optional()
    .default('image')
    .describe(JSON.stringify({
      text: 'The type of asset to deliver.',
      url: 'https://cloudinary.com/documentation/image_transformations#transformation_url_structure'
    })),
  crop: z.string()
    .optional()
    .describe(JSON.stringify({
      text: 'Mode to use when cropping an asset.',
      url: 'https://cloudinary.com/documentation/transformation_reference#c_crop_resize'
    })),
  deliveryType: z.string().optional(),
  effects: z.array(z.any()).optional(),
  flags: z.union([
    z.array(z.string()),
    z.any()
  ]).optional(),
  format: z.string().optional(),
  gravity: z.string().optional(),
  height: z.union([z.string(), z.number()]).optional(),
  overlays: z.array(z.any()).optional(),
  quality: z.union([z.number(), z.string()]).optional(),
  rawTransformations: z.array(z.string()).optional(),
  removeBackground: z.boolean().optional(),
  sanitize: z.boolean().optional(),
  resize: assetOptionsResizeSchema.optional(),
  seoSuffix: z.string().optional(),
  src: z.string(),
  text: z.string().optional().describe(JSON.stringify({
    text: 'Text to be overlaid on asset'
  })),
  transformations: z.array(z.string()).optional(),
  underlay: z.string().optional(),
  underlays: z.array(z.any()).optional(),
  version: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.string(), z.number()]).optional(),
  widthResize: z.union([z.string(), z.number()]).optional(),
  zoom: z.string().optional()
})

export type AssetOptions = z.infer<typeof assetOptionsSchema>;