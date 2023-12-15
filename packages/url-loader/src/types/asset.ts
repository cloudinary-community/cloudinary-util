import { z } from 'zod';

// Asset Options

export const assetOptionsSchema = z.object({
  assetType: z.string()
    .default('image')
    .describe(JSON.stringify({
      text: 'The type of asset to deliver.',
      url: 'https://cloudinary.com/documentation/image_transformations#transformation_url_structure'
    }))
    .optional(),
  aspectRatio: z.union([ z.string(), z.number() ])
    .describe(JSON.stringify({
      text: 'Crops or resizes the asset to a new aspect ratio.',
      url: 'https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio'
    }))
    .optional(),
  crop: z.string()
    .default('scale')
    .describe(JSON.stringify({
      text: 'Mode to use when cropping an asset.',
      url: 'https://cloudinary.com/documentation/transformation_reference#c_crop_resize'
    }))
    .optional(),
  deliveryType: z.string()
    .default('upload')
    .describe(JSON.stringify({
      text: 'Delivery method of the asset.',
      url: 'https://cloudinary.com/documentation/image_transformations#delivery_types'
    }))
    .optional(),
  dpr: z.union([ z.string(), z.number() ])
    .describe(JSON.stringify({
      text: 'Delivery method of the asset.',
      url: 'https://cloudinary.com/documentation/image_transformations#delivery_types'
    }))
    .optional(),
  effects: z.array(z.any())
    .describe(JSON.stringify({
      text: 'Array of objects specifying transformations to be applied to asset.'
    })).optional(),
  flags: z.union([ z.array(z.string()), z.any() ])
    .describe(JSON.stringify({
      text: 'Alters the regular behavior of another transformation or the overall delivery behavior.',
      url: 'https://cloudinary.com/documentation/transformation_reference#fl_flag'
    }))
    .optional(),
  format: z.string()
    .default('auto')
    .describe(JSON.stringify({
      text: 'Converts (if necessary) and delivers an asset in the specified format.',
      url: 'https://cloudinary.com/documentation/transformation_reference#f_format'
    }))
    .optional(),
  gravity: z.string()
    .default('auto')
    .describe(JSON.stringify({
      text: 'Determines which part of an asset to focus on. Note: Default of auto is applied for supported crop modes only.',
      url: 'https://cloudinary.com/documentation/transformation_reference#g_gravity'
    }))
    .optional(),
  height: z.union([z.string(), z.number()])
    .describe(JSON.stringify({
      text: 'Height of the given asset.'
    }))
    .optional(),
  overlays: z.array(z.any())
    .describe(JSON.stringify({
      text: 'Image or text layers that are applied on top of the base image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#l_layer'
    }))
    .optional(),
  quality: z.union([z.number(), z.string()])
    .default('auto')
    .describe(JSON.stringify({
      text: 'Quality of the delivered asset',
      url: 'https://cloudinary.com/documentation/transformation_reference#q_quality'
    }))
    .optional(),
  rawTransformations: z.array(z.string())
    .describe(JSON.stringify({
      text: 'Array of URL transformation parameters to apply to an asset.',
      url: 'https://cloudinary.com/documentation/transformation_reference'
    }))
    .optional(),
  removeBackground: z.boolean()
    .describe(JSON.stringify({
      text: 'Removes the background of an image using the Cloudinary AI Background Removal Add-On (Required).',
      url: 'https://cloudinary.com/documentation/cloudinary_ai_background_removal_addon'
    }))
    .optional(),
  sanitize: z.boolean()
    .describe(JSON.stringify({
      text: 'Runs a sanitizer on SVG images.',
      url: 'https://cloudinary.com/documentation/transformation_reference#fl_sanitize'
    }))
    .optional(),
  seoSuffix: z.string()
    .describe(JSON.stringify({
      text: 'Configures the URL to include an SEO-friendly suffix in the URL',
      url: 'https://cloudinary.com/documentation/advanced_url_delivery_options#seo_friendly_media_asset_urls'
    }))
    .optional(),
  src: z.string()
    .describe(JSON.stringify({
        text: 'Cloudinary Public ID or versioned Cloudinary URL (/v1234/)'
      })),
  strictTransformations: z.boolean()
    .describe(JSON.stringify({
      text: 'Gives you the ability to have more control over what transformations are permitted to be used from your Cloudinary account.',
      url: 'https://cloudinary.com/documentation/control_access_to_media#strict_transformations'
    }))
    .optional(),
  text: z.string()
    .describe(JSON.stringify({
      text: 'Text to be overlaid on asset.',
      url: 'https://cloudinary.com/documentation/image_transformations#transformation_url_structure'
    })).optional(),
  transformations: z.array(z.string())
    .describe(JSON.stringify({
      text: 'Named transformations to apply to asset.',
      url: 'https://cloudinary.com/documentation/image_transformations#named_transformations'
    }))
    .optional(),
  underlay: z.string()
    .describe(JSON.stringify({
      text: 'Public ID of image that is applied under the base image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#l_layer'
    }))
    .optional(),
  underlays: z.array(z.any())
    .describe(JSON.stringify({
      text: 'Image layers that are applied under the base image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#l_layer'
    }))
    .optional(),
  version: z.union([z.number(), z.string()])
    .describe(JSON.stringify({
      text: 'Custom version number to apply to asset URL.',
      url: 'https://cloudinary.com/documentation/advanced_url_delivery_options#asset_versions'
    }))
    .optional(),
  width: z.union([z.string(), z.number()])
    .describe(JSON.stringify({
      text: 'Width of the given asset.',
    }))
    .optional(),
  widthResize: z.union([z.string(), z.number()])
    .describe(JSON.stringify({
      text: 'Width to resize the asset after all transformations are applied. Useful for responsive resizing.',
    }))
    .optional(),
  zoom: z.string()
    .describe(JSON.stringify({
      text: 'Controls how close to crop to the detected coordinates when using face-detection, custom-coordinate, or object-specific gravity.',
      url: 'https://cloudinary.com/documentation/transformation_reference#z_zoom'
    }))
    .optional()
})

export type AssetOptions = z.infer<typeof assetOptionsSchema>;
