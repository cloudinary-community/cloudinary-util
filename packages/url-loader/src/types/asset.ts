import { z } from 'zod';

import { props as croppingPluginProps } from '../plugins/cropping';
import { props as effectsPluginProps } from '../plugins/effects';
import { props as flagsPluginProps } from '../plugins/flags';
import { props as namedTransformationsPluginProps } from '../plugins/named-transformations';
import { props as overlaysPluginProps } from '../plugins/overlays';
import { props as rawTransformationsPluginProps } from '../plugins/raw-transformations';
import { props as removeBackgroundPluginProps } from '../plugins/remove-background';
import { props as sanitizePluginProps } from '../plugins/sanitize';
import { props as seoPluginProps } from '../plugins/seo';
import { props as underlaysPluginProps } from '../plugins/underlays';
import { props as versionPluginProps } from '../plugins/version';

// Asset Options

export const assetOptionsSchema = z.object({
  assetType: z.string()
    .default('image')
    .describe(JSON.stringify({
      text: 'The type of asset to deliver.',
      url: 'https://cloudinary.com/documentation/image_transformations#transformation_url_structure'
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
  format: z.string()
    .default('auto')
    .describe(JSON.stringify({
      text: 'Converts (if necessary) and delivers an asset in the specified format.',
      url: 'https://cloudinary.com/documentation/transformation_reference#f_format'
    }))
    .optional(),
  height: z.union([z.string(), z.number()])
    .describe(JSON.stringify({
      text: 'Height of the given asset.'
    }))
    .optional(),
  quality: z.union([z.string(), z.number(), z.string()])
    .default('auto')
    .describe(JSON.stringify({
      text: 'Quality of the delivered asset',
      url: 'https://cloudinary.com/documentation/transformation_reference#q_quality'
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
  width: z.union([z.string(), z.number()])
    .describe(JSON.stringify({
      text: 'Width of the given asset.',
    }))
    .optional(),

  // Spreading plugins instead of extend or merge to avoid excessive schema warning
  // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
  
  ...croppingPluginProps,
  ...effectsPluginProps,
  ...flagsPluginProps,
  ...namedTransformationsPluginProps,
  ...overlaysPluginProps,
  ...rawTransformationsPluginProps,
  ...removeBackgroundPluginProps,
  ...sanitizePluginProps,
  ...seoPluginProps,
  ...underlaysPluginProps,
  ...versionPluginProps,
})

export type AssetOptions = z.infer<typeof assetOptionsSchema>;
