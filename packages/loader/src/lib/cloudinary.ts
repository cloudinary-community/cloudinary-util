import { Cloudinary } from '@cloudinary/url-gen';
import { getPublicId } from '@cloudinary-util/helpers';

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

interface ConstructUrlProps {
  options: ImageOptions;
  config?: ICloudinaryConfigurations;
  analytics?: IAnalyticsOptions;
}

/**
 * constructCloudinaryUrl
 */

export function constructCloudinaryUrl({ options, config, analytics }: ConstructUrlProps): string {
  if ( !cld ) {
    cld = new Cloudinary(config);
  }

  if ( !options?.src ) {
    throw Error(`Failed to construct Cloudinary URL: Missing source (src) in options`);
  }

  const publicId = getPublicId(options.src);

  const cldImage = cld.image(publicId);

  transformationPlugins.forEach(({ plugin }) => {
    // @ts-ignore
    const { options: pluginOptions } = plugin({
      cldImage,
      options
    }) || {};

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


/**
 * createPlaceholderUrl
 */

export function createPlaceholderUrl({ src, placeholder = true, config }: { src?: any, placeholder?: boolean | string, config?: any }) {
  const rawTransformations: string[] = [];

  if ( placeholder === 'grayscale' ) {
    rawTransformations.push('e_grayscale');
  }

  if ( typeof placeholder === 'string' && placeholder.includes('color:') ) {
    const color = placeholder.split(':').splice(1).join(':')
    rawTransformations.push('e_grayscale');
    rawTransformations.push(`e_colorize:60,co_${color}`);
  }

  return constructCloudinaryUrl({
    options: {
      src,
      width: 100,
      quality: 1,
      rawTransformations,
    },
    config
  });
}

/**
 * pollForProcessingImage
 */

export async function pollForProcessingImage(options: any): Promise<boolean> {
  const { src } = options;
  try {
    await new Promise((resolve, reject) => {
      fetch(src).then(res => {
        if ( !res.ok ) {
          reject(res);
          return;
        }
        resolve(res);
      });
    });
  } catch(e: any) {
    if ( e.status === 423 ) {
      return await pollForProcessingImage(options);
    }
    return false;
  }
  return true;
}