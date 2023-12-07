import { Cloudinary } from '@cloudinary/url-gen';
import { parseUrl, ParseUrl, objectHasKey } from '@cloudinary-util/util';

import * as croppingPlugin from '../plugins/cropping';
import * as defaultImagePlugin from '../plugins/default-image';
import * as effectsPlugin from '../plugins/effects';
import * as flagsPlugin from '../plugins/flags';
import * as fillBackgroundPlugin from '../plugins/fill-background';
import * as removePlugin from '../plugins/remove';
import * as restorePlugin from '../plugins/restore';
import * as sanitizePlugin from '../plugins/sanitize';
import * as overlaysPlugin from '../plugins/overlays';
import * as namedTransformationsPlugin from '../plugins/named-transformations';
import * as rawTransformationsPlugin from '../plugins/raw-transformations';
import * as removeBackgroundPlugin from '../plugins/remove-background';
import * as generativeReplacePlugin from '../plugins/generative-replace';
import * as seoPlugin from '../plugins/seo';
import * as underlaysPlugin from '../plugins/underlays';
import * as versionPlugin from '../plugins/version';
import * as videoPlugin from '../plugins/video';
import * as zoompanPlugin from '../plugins/zoompan';

import { ImageOptions } from '../types/image';
import { AnalyticsOptions } from '../types/analytics';
import { ConfigOptions } from '../types/config';
import { TransformationPlugin } from '../types/plugins';

export const transformationPlugins = [

  // Some features *must* be the first transformation applied
  // thus their plugins *must* come first in the chain

  generativeReplacePlugin,
  removeBackgroundPlugin,
  removePlugin,
  restorePlugin,

  // Raw transformations should always come before
  // other arguments to avoid conflicting with
  // added options via the component

  rawTransformationsPlugin,

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
  videoPlugin,
  zoompanPlugin,
];

/**
 * constructCloudinaryUrl
 * @description Builds a full Cloudinary URL using transformation plugins specified by options
 */

export interface ConstructUrlProps {
  options: ImageOptions;
  config?: ConfigOptions;
  analytics?: AnalyticsOptions;
}

export interface PluginOptionsResize {
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

export function constructCloudinaryUrl({ options, config, analytics }: ConstructUrlProps): string {
  const cld = new Cloudinary(config);

  if ( typeof options?.src !== 'string' ) {
    throw Error(`Failed to construct Cloudinary URL: Missing source (src) in options`);
  }

  if ( !options?.assetType ) {
    options.assetType = 'image';
  }

  const propsCheck: Array<string> = [];

  transformationPlugins.forEach(({ props = [] }) => {
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

  transformationPlugins.forEach(({ plugin, assetTypes, props, strict }: TransformationPlugin) => {
    const supportedAssetType = typeof options?.assetType !== 'undefined' && assetTypes.includes(options?.assetType);

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
      options.format = pluginOptions.format;
    }

    if ( pluginOptions?.width && options ) {
      options.resize = {
        width: pluginOptions?.width
      };
    }
  });

  // We want to perform any resizing at the end of the end of the transformation
  // sets to allow consistent use of positioning / sizing, especially responsively

  if ( options?.resize && !options.strictTransformations ) {
    const { width, crop = 'limit' } = options.resize;
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
      cldAsset.format(options?.format || 'auto')
    }

    if ( options?.quality !== 'default' ) {
      cldAsset.quality(options?.quality || 'auto')
    }

  }

  return cldAsset.toURL({
    trackedAnalytics: analytics
  });
}
