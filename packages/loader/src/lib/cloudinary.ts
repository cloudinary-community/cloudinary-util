import { Cloudinary } from '@cloudinary/url-gen';
import { getPublicId } from '@cloudinary-util/util';

import * as croppingPlugin from '../plugins/cropping';
import * as effectsPlugin from '../plugins/effects';
import * as overlaysPlugin from '../plugins/overlays';
import * as namedTransformationsPlugin from '../plugins/named-transformations';
import * as rawTransformationsPlugin from '../plugins/raw-transformations';
import * as removeBackgroundPlugin from '../plugins/remove-background';
import * as underlaysPlugin from '../plugins/underlays';
import * as zoompanPlugin from '../plugins/zoompan';

import { ImageOptions } from '../types/image';

import ICloudinaryConfigurations from '@cloudinary/url-gen/config/interfaces/Config/ICloudinaryConfigurations';
import { IAnalyticsOptions } from '@cloudinary/url-gen/sdkAnalytics/interfaces/IAnalyticsOptions';

export const transformationPlugins = [
  // Background Removal must always come first
  removeBackgroundPlugin,

  croppingPlugin,
  effectsPlugin,
  overlaysPlugin,
  namedTransformationsPlugin,
  underlaysPlugin,
  zoompanPlugin,

  // Raw transformations needs to be last simply to make sure
  // it's always expected to applied the same way

  rawTransformationsPlugin
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

  let publicId;

  // If the src starts with https, try to parse the URL to grab the ID dynamically
  // otherwise fall back to the src which should be a public ID

  if ( options.src.startsWith('https://') ) {
    publicId = getPublicId(options.src);
  } else {
    publicId = options.src;
  }

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