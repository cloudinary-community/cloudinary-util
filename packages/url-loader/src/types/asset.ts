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
  assetType: z.string().optional(),
  crop: z.string().optional(),
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
  text: z.any().optional(),
  transformations: z.array(z.string()).optional(),
  underlay: z.string().optional(),
  underlays: z.array(z.any()).optional(),
  version: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.string(), z.number()]).optional(),
  widthResize: z.union([z.string(), z.number()]).optional(),
  zoom: z.string().optional()
})

export type AssetOptions = z.infer<typeof assetOptionsSchema>;