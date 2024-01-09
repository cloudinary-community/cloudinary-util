import { z } from 'zod';
import { Cloudinary } from '@cloudinary/url-gen';
import { parseUrl, ParseUrl, objectHasKey } from '@cloudinary-util/util';

import * as abrPlugin from '../plugins/abr';
import * as croppingPlugin from '../plugins/cropping';
import * as defaultImagePlugin from '../plugins/default-image';
import * as effectsPlugin from '../plugins/effects';
import * as flagsPlugin from '../plugins/flags';
import * as fillBackgroundPlugin from '../plugins/fill-background';
import * as replacePlugin from '../plugins/replace';
import * as namedTransformationsPlugin from '../plugins/named-transformations';
import * as overlaysPlugin from '../plugins/overlays';
import * as rawTransformationsPlugin from '../plugins/raw-transformations';
import * as recolorPlugin from '../plugins/recolor';
import * as removePlugin from '../plugins/remove';
import * as removeBackgroundPlugin from '../plugins/remove-background';
import * as restorePlugin from '../plugins/restore';
import * as sanitizePlugin from '../plugins/sanitize';
import * as seoPlugin from '../plugins/seo';
import * as underlaysPlugin from '../plugins/underlays';
import * as versionPlugin from '../plugins/version';
import * as zoompanPlugin from '../plugins/zoompan';

import { assetOptionsSchema } from '../types/asset';
import { imageOptionsSchema } from '../types/image';
import { videoOptionsSchema } from '../types/video';
import { analyticsOptionsSchema } from '../types/analytics';
import { configOptionsSchema } from '../types/config';

import { TransformationPlugin } from '../types/plugins';


export const transformationPlugins = [

  // Some features *must* be the first transformation applied
  // thus their plugins *must* come first in the chain

  recolorPlugin,
  removePlugin,
  removeBackgroundPlugin,
  replacePlugin,
  restorePlugin,

  // Raw transformations should always come before
  // other arguments to avoid conflicting with
  // added options via the component

  rawTransformationsPlugin,

  abrPlugin,
  croppingPlugin,
  defaultImagePlugin,
  effectsPlugin,
  fillBackgroundPlugin,
  flagsPlugin,
  overlaysPlugin,
  sanitizePlugin,
  namedTransformationsPlugin,
  seoPlugin,
  underlaysPlugin,
  versionPlugin,
  zoompanPlugin,
];

/**
 * constructCloudinaryUrl
 * @description Builds a full Cloudinary URL using transformation plugins specified by options
 */

export const constructUrlPropsSchema = z.object({
  analytics: z.union([
      analyticsOptionsSchema,
      z.boolean()
    ])
    .describe(JSON.stringify({
      text: 'Tech, dependency, and feature identifiers for tracking SDK usage.',
      path: '/analyticsoptions'
    }))
    .optional(),
  config: configOptionsSchema
    .describe(JSON.stringify({
      text: 'Configuration parameters for environment and Cloudinary account.',
      url: 'https://cloudinary.com/documentation/cloudinary_sdks#configuration_parameters',
      path: '/analyticsoptions'
    }))
    .optional(),
  options: z.union([
      assetOptionsSchema,
      imageOptionsSchema,
      videoOptionsSchema,
    ])
    .describe(JSON.stringify({
      text: 'Asset options (Image or Video) that define delivery URL including public ID and transformations.',
      path: '/assetoptions'
    })),
})

export type ConstructUrlProps = z.infer<typeof constructUrlPropsSchema>;

export interface PluginOptionsResize {
  crop?: string;
  width?: string | number;
}

export interface PluginOptions {
  format?: string;
  resize?: PluginOptionsResize;
  width?: string | number;
}

export interface PluginResults {
  options?: PluginOptions;
}

export function constructCloudinaryUrl({ options, config = {}, analytics }: ConstructUrlProps): string {
  // If someone is explicitly passing in undefined for analytics via the analytics option,
  // ensure that the URL Gen SDK option is being passed in as false as well

  if ( analytics === false ) {
    if ( typeof config?.url === 'undefined' ) {
      config.url = {};
    }
    config.url.analytics = false;
  }

  const cld = new Cloudinary(config);

  if ( typeof options?.src !== 'string' ) {
    throw Error(`Failed to construct Cloudinary URL: Missing source (src) in options`);
  }

  if ( !options?.assetType ) {
    options.assetType = 'image';
  }

  const propsCheck: Array<string> = [];

  transformationPlugins.forEach(({ pluginProps }) => {
    const props = Object.keys(pluginProps);

    props.forEach(prop => {
      if ( propsCheck.includes(prop) ) {
        throw new Error(`Option ${prop} already exists!`);
      }
      propsCheck.push(prop);
    });
  })

  const parsedOptions: Pick<ParseUrl, 'seoSuffix' | 'version'> = {};

  let publicId;

  // If the src starts with https, try to parse the URL to grab the ID dynamically
  // otherwise fall back to the src which should be a public ID or a remote URL
  // which will work when using the delivery type of fetch

  if ( typeof options.src === 'string' && /^https?:\/\//.test(options.src) ) {
    try {
      const parts = parseUrl(options.src);
      publicId = parts?.publicId;
      parsedOptions.seoSuffix = parts?.seoSuffix;
      parsedOptions.version = parts?.version;
    } catch(e) {}
  }

  if ( !publicId ) {
    publicId = options.src;
  }

  // Take all the parsed URL parts and apply them to the options configuration
  // if there isn't an existing override

  (Object.keys(parsedOptions) as Array<keyof typeof parsedOptions>).forEach((key) => {
    if ( objectHasKey(options, key) ) return;
    options[key] = parsedOptions[key];
  });

  // Begin creating a new Cloudinary image instance and configure

  let cldAsset: any = undefined;

  if ( ['image', 'images'].includes(options.assetType) ) {
    cldAsset = cld.image(publicId);
  } else if ( ['video', 'videos'].includes(options.assetType) ) {
    cldAsset = cld.video(publicId);
  }

  if ( typeof cldAsset === 'undefined' ) {
    throw new Error('Invalid asset type.');
  }

  const pluginEffects: PluginOptions = {};

  transformationPlugins.forEach(({ plugin, assetTypes, pluginProps, strict }: TransformationPlugin) => {
    const supportedAssetType = typeof options?.assetType !== 'undefined' && assetTypes.includes(options?.assetType);
    const props = Object.keys(pluginProps);
    const optionsKeys = Object.keys(options);
    const attemptedUse = props.map(prop => optionsKeys.includes(prop)).filter(isUsed => !!isUsed).length > 0;

    if ( !supportedAssetType ) {
      if ( attemptedUse ) {
        console.warn(`One of the following props [${props.join(', ')}] was used with an unsupported asset type [${options?.assetType}]`);
      }
      return;
    }

    if ( options.strictTransformations && !strict ) {
      if ( attemptedUse ) {
        console.warn(`One of the following props [${props.join(', ')}] was used that is not supported with Strict Transformations.`);
      }
      return;
    }

    const results: PluginResults = plugin({
      cldAsset,
      options
    });

    const { options: pluginOptions } = results || { options: undefined };

    if ( pluginOptions?.format && options ) {
      pluginEffects.format = pluginOptions.format;
    }

    if ( pluginOptions?.width && options ) {
      pluginEffects.resize = {
        width: pluginOptions?.width
      };
    }
  });

  // We want to perform any resizing at the end of the end of the transformation
  // sets to allow consistent use of positioning / sizing, especially responsively

  if ( pluginEffects?.resize && !options.strictTransformations ) {
    const { width, crop = 'limit' } = pluginEffects.resize;
    cldAsset.effect(`c_${crop},w_${width}`);
  }

  cldAsset.setDeliveryType(options?.deliveryType || 'upload');

  // Strict transformations requires opt-in for any transformation. If this is
  // enabled, nothing should be added on top of the URL

  if ( !options.strictTransformations ) {

    if ( options?.dpr ) {
      let dpr = options.dpr;
      if ( typeof dpr === 'number' ) {
        dpr = dpr.toFixed(1);
      }
      cldAsset.addTransformation(`dpr_${dpr}`)
    }

    if ( options?.format !== 'default' ) {
      cldAsset.format(options?.format || pluginEffects?.format || 'auto')
    }

    if ( options?.quality !== 'default' ) {
      cldAsset.quality(options?.quality || 'auto')
    }

  }

  return cldAsset.toURL({
    trackedAnalytics: analytics
  });
}