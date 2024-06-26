import { z } from 'zod';
import { Cloudinary, CloudinaryImage, CloudinaryVideo } from '@cloudinary/url-gen';
import { parseUrl, ParseUrl, objectHasKey } from '@cloudinary-util/util';

import * as abrPlugin from '../plugins/abr';
import * as croppingPlugin from '../plugins/cropping';
import * as defaultImagePlugin from '../plugins/default-image';
import * as effectsPlugin from '../plugins/effects';
import * as enhancePlugin from '../plugins/enhance';
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

import { TransformationPlugin, PluginResults, PluginOptions } from '../types/plugins';


export const transformationPlugins = [

  // Some features *must* be the first transformation applied
  // thus their plugins *must* come first in the chain

  enhancePlugin,
  recolorPlugin,
  removeBackgroundPlugin,
  removePlugin,
  replacePlugin,
  restorePlugin,

  // Cropping needs to be before any other general transformations
  // as it provides the option of 2-step resizing where someone
  // can resize the "base" canvas as well as the final resize
  // mechanism commonly used for responsive resizing
  croppingPlugin,

  // Raw transformations should always come before
  // other arguments to avoid conflicting with
  // added options via the component

  rawTransformationsPlugin,

  abrPlugin,
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
      text: 'Tech, dependency, and feature identifiers for tracking SDK usage related to Cloudinary.',
      path: '/url-loader/analyticsoptions'
    }))
    .optional(),
  config: configOptionsSchema
    .describe(JSON.stringify({
      text: 'Configuration parameters for environment and Cloudinary account.',
      url: 'https://cloudinary.com/documentation/cloudinary_sdks#configuration_parameters',
      path: '/url-loader/analyticsoptions'
    }))
    .optional(),
  options: z.union([
      assetOptionsSchema,
      imageOptionsSchema,
      videoOptionsSchema,
    ])
    .describe(JSON.stringify({
      text: 'Asset options (Image or Video) that define delivery URL including public ID and transformations.',
      path: '/url-loader/assetoptions'
    })),
})

export type ConstructUrlProps = z.infer<typeof constructUrlPropsSchema>;

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
    throw Error(`Failed to construct Cloudinary URL: Missing source (src) in options.`);
  }

  if ( !options?.assetType ) {
    options.assetType = 'image';
  }

  const propsCheck: Array<string> = [];

  transformationPlugins.forEach(({ props }) => {
    const pluginProps = Object.keys(props);

    pluginProps.forEach(prop => {
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

  transformationPlugins.forEach(({ plugin, assetTypes, props, strict }: TransformationPlugin) => {
    const supportedAssetType = typeof options?.assetType !== 'undefined' && assetTypes.includes(options?.assetType);
    const pluginProps = Object.keys(props);
    const optionsKeys = Object.keys(options);
    const attemptedUse = pluginProps.map(prop => optionsKeys.includes(prop)).filter(isUsed => !!isUsed).length > 0;

    if ( !supportedAssetType ) {
      if ( attemptedUse ) {
        console.warn(`One of the following props [${pluginProps.join(', ')}] was used with an unsupported asset type [${options?.assetType}]`);
      }
      return;
    }

    if ( options.strictTransformations && !strict ) {
      if ( attemptedUse ) {
        console.warn(`One of the following props [${pluginProps.join(', ')}] was used that is not supported with Strict Transformations.`);
      }
      return;
    }

    const results: PluginResults = plugin({
      cldAsset,
      options
    });

    const { options: pluginOptions } = results || { options: undefined };

    Object.assign(pluginEffects, pluginOptions);
  });

  // We want to perform any resizing at the end of the end of the transformation
  // sets to allow consistent use of positioning / sizing, especially responsively

  if ( typeof pluginEffects.resize === 'string' ) {
    cldAsset.addTransformation(pluginEffects.resize);
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

    // An enhancement to our delivery URL is to automatically opt into optimization
    // including both the most efficient format and automatic compression. However,
    // we want to be able to give someone the ability to opt out (default) or if
    // we already detect a format or quality in the URL, such as consuming an
    // existing Cloudianry URL as the source, we don't want to double apply it
    // which can cause conflicts with the previous asset

    const defaultFormat = options?.format === 'default'
    const rawContainsFormat = searchAssetRawTransformations('f_', cldAsset, { matchType: 'startsWith' });
    const rawContainsFormatAndExplicit = rawContainsFormat && typeof options?.format !== 'undefined';

    if ( pluginEffects?.format || (!defaultFormat && (!rawContainsFormat || rawContainsFormatAndExplicit)) ) {
      cldAsset.format(options?.format || pluginEffects?.format || 'auto')
    }

    const defaultQuality = options?.quality === 'default'
    const rawContainsQuality = searchAssetRawTransformations('q_', cldAsset, { matchType: 'startsWith' });
    const rawContainsQualityAndExplicit = rawContainsQuality && typeof options?.quality !== 'undefined';

    if ( !defaultQuality && (!rawContainsQuality || rawContainsQualityAndExplicit) ) {
      cldAsset.quality(options?.quality || 'auto')
    }
  }

  return cldAsset.toURL({
    trackedAnalytics: analytics
  });
}

/**
 * searchAssetRawTransformations
 * @description Given a CloudinaryImage or CloudinaryVideo, searches raw transformations applied to the instance
 */

interface SearchAssetRawTransformationsOptions {
  matchType: string;
}

export function searchAssetRawTransformations(query: string, asset: CloudinaryImage | CloudinaryVideo, options?: SearchAssetRawTransformationsOptions) {
  if ( typeof asset.transformation === 'undefined' ) return;

  const { matchType = 'includes' } = options || {};

  const transformations = asset.transformation.actions.flatMap((transformation) => {
    // Raw transformations can come in different shapes and sizes including
    // `['f_auto/q_auto']` or `['f_auto','q_auto']` so attempt to handle both
    return transformation.toString().split('/').flatMap(seg => seg.split(','));
  });

  const matches = transformations.filter(transformation => {
    if ( matchType === 'startsWith' ) {
      return transformation.startsWith(query);
    } else {
      return transformation.includes(query);
    }
  });

  return matches.length > 0;
}