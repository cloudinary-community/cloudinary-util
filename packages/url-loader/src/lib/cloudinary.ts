import { Cloudinary } from '@cloudinary/url-gen';
import { parseUrl, ParseUrl, objectHasKey } from '@cloudinary-util/util';
import ICloudinaryConfigurations from '@cloudinary/url-gen/config/interfaces/Config/ICloudinaryConfigurations';
import { IAnalyticsOptions } from '@cloudinary/url-gen/sdkAnalytics/interfaces/IAnalyticsOptions';

import * as croppingPlugin from '../plugins/cropping';
import * as effectsPlugin from '../plugins/effects';
import * as sanitizePlugin from '../plugins/sanitize';
import * as overlaysPlugin from '../plugins/overlays';
import * as namedTransformationsPlugin from '../plugins/named-transformations';
import * as rawTransformationsPlugin from '../plugins/raw-transformations';
import * as removeBackgroundPlugin from '../plugins/remove-background';
import * as seoPlugin from '../plugins/seo';
import * as underlaysPlugin from '../plugins/underlays';
import * as versionPlugin from '../plugins/version';
import * as zoompanPlugin from '../plugins/zoompan';

import { ImageOptions } from '../types/image';

export const transformationPlugins = [
  // Background Removal must always come first

  removeBackgroundPlugin,

  // Raw transformations should always come before
  // other arguments to avoid conflicting with
  // added options via the component

  rawTransformationsPlugin,

  croppingPlugin,
  effectsPlugin,
  overlaysPlugin,
  sanitizePlugin,
  namedTransformationsPlugin,
  seoPlugin,
  underlaysPlugin,
  versionPlugin,
  zoompanPlugin,
];

let cld: any;

/**
 * constructCloudinaryUrl
 * @description Builds a full Cloudinary URL using transformation plugins specified by options
 */

interface ConstructUrlProps {
  options: ImageOptions;
  config?: ICloudinaryConfigurations;
  analytics?: IAnalyticsOptions;
}

interface PluginOptionsResize {
  width?: string | number;
}

interface PluginOptions {
  format?: string;
  resize?: PluginOptionsResize;
  width?: string | number;
}

interface PluginResults {
  options?: PluginOptions;
}

export function constructCloudinaryUrl({ options, config, analytics }: ConstructUrlProps): string {
  if ( !cld ) {
    cld = new Cloudinary(config);
  }

  if ( !options?.src ) {
    throw Error(`Failed to construct Cloudinary URL: Missing source (src) in options`);
  }

  const parsedOptions: Pick<ParseUrl, 'seoSuffix' | 'version'> = {
    seoSuffix: undefined,
    version: undefined,
  };

  let publicId;

  // If the src starts with https, try to parse the URL to grab the ID dynamically
  // otherwise fall back to the src which should be a public ID or a remote URL
  // which will work when using the delivery type of fetch

  if ( options.src.startsWith('https://') ) {
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

  const cldImage = cld.image(publicId);

  transformationPlugins.forEach(({ plugin }) => {
    const results: PluginResults = plugin({
      cldImage,
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

  if ( options?.resize ) {
    const { width, crop = 'scale' } = options.resize;
    cldImage.effect(`c_${crop},w_${width}`);
  }

  return cldImage
          .setDeliveryType(options?.deliveryType || 'upload')
          .format(options?.format || 'auto')
          .delivery(`q_${options?.quality || 'auto'}`)
          .toURL({
            trackedAnalytics: analytics
          });
}
