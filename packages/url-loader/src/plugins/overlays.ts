import { z } from 'zod';
import { encodeBase64, objectHasKey, sortByKey } from '@cloudinary-util/util';

import { PluginSettings } from '../types/plugins';
import { Qualifier } from '../types/qualifiers';

import { constructTransformation } from '../lib/transformations';

import {
  effects as qualifiersEffects,
  flags as qualifiersFlags,
  position as qualifiersPosition,
  primary as qualifiersPrimary,
  text as qualifiersText,
} from '../constants/qualifiers';

export const pluginProps = {
  // @todo
  // overlay: {
  //   prefix: 'e',
  //   qualifier: 'overlay',
  //   schema: z.boolean()
  //     .describe(JSON.stringify({
  //       text: '',
  //       url: 'asdf',
  //     }))
  //     .optional(),
  // },
  overlays: z.any()
    .describe(JSON.stringify({
      text: 'Image or text layers that are applied on top of the base image.',
      url: 'https://cloudinary.com/documentation/transformation_reference#l_layer'
    }))
    .optional(),
  text: z.string()
    .describe(JSON.stringify({
      text: 'Text to be overlaid on asset.',
      url: 'https://cloudinary.com/documentation/image_transformations#transformation_url_structure'
    })).optional(),
};

export const assetTypes = ['image', 'images', 'video', 'videos'];

export const DEFAULT_TEXT_OPTIONS = {
  color: 'black',
  fontFamily: 'Arial',
  fontSize: 200,
  fontWeight: 'bold',
};

const supportedFlags = Object.entries(qualifiersFlags).map(([_, { qualifier }]) => qualifier);

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { text, overlays = [] } = options;

  const type = 'overlay';
  const typeQualifier = 'l';

  if ( Array.isArray(overlays) ) {
    overlays.forEach(applyOverlay);
  }

  if ( typeof text === 'string' ) {
    applyOverlay({
      text: Object.assign({}, DEFAULT_TEXT_OPTIONS, {
        text
      })
    })
  } else if ( typeof text === 'object' ) {
    applyOverlay({
      text: Object.assign({}, DEFAULT_TEXT_OPTIONS, text)
    })
  }

  /**
   * applyOverlay
   */

  interface ApplyOverlaySettingsText {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    text: string;
  }

  interface ApplyOverlaySettings {
    appliedEffects?: Array<object>;
    effects?: Array<object>;
    appliedFlags?: Array<string>;
    flags?: Array<string>;
    position?: string;
    publicId?: string;
    text?: string | ApplyOverlaySettingsText;
    url?: string;
  }

  function applyOverlay({ publicId, url, position, text, effects: layerEffects = [], appliedEffects = [], flags: layerFlags = [], appliedFlags = [], ...options }: ApplyOverlaySettings) {
    const hasPublicId = typeof publicId === 'string';
    const hasUrl = typeof url === 'string';
    const hasText = typeof text === 'object' || typeof text === 'string';
    const hasPosition = typeof position === 'object';

    if ( !hasPublicId && !hasUrl && !hasText ) {
      console.warn(`An ${type} is missing Public ID, URL, or Text`);
      return;
    }

    // Start to construct the transformation string using text or the public ID
    // if it's image-based

    let layerTransformation;

    if ( hasText ) {
      layerTransformation = `${typeQualifier}_text`;
    } else if ( hasPublicId ) {
      layerTransformation = `${typeQualifier}_${publicId.replace(/\//g, ':')}`;
    } else if ( hasUrl ) {
      layerTransformation = `${typeQualifier}_fetch:${encodeBase64(url)}`;
    }

    // Begin organizing transformations based on what it is and the location
    // it needs to be placed in the URL

    const primary: Array<string> = [];
    const applied: Array<string> = [];

    // Gemeral options

    (Object.keys(options) as Array<keyof typeof options>).forEach(key => {
      if ( !objectHasKey(qualifiersPrimary, key) ) return;

      const { qualifier, converters } = qualifiersPrimary[key];

      const transformation = constructTransformation({
        qualifier,
        value: options[key],
        converters
      });

      if ( transformation ) {
        primary.push(transformation);
      }
    });

    // Layer effects
    // For layer effects we allow both the standard effects to be applied as well
    // as the primary ones like width and height as those can be used to modify
    // the layer after it's created

    layerEffects.forEach(effect => {
      (Object.keys(effect) as Array<keyof typeof effect>).forEach(key => {
        const effectQualifier = qualifiersPrimary[key] || qualifiersEffects[key] || qualifiersPosition[key];

        // If the qualifier isn't defined, it means it doesnt exist

        if ( !effectQualifier ) return;

        const { qualifier, prefix, converters } = effectQualifier;

        const transformation = constructTransformation({
          qualifier,
          prefix,
          value: effect[key],
          converters
        });

        if ( transformation ) {
          primary.push(transformation);
        }
      });
    });

    // Applied Layer effects
    // Similar to layer effects but they get appended to an additional transformation
    // along with fl_layer_applied

    appliedEffects.forEach(effect => {
      (Object.keys(effect) as Array<keyof typeof effect>).forEach(key => {
        const effectQualifier = qualifiersPrimary[key] || qualifiersEffects[key] || qualifiersPosition[key];

        // If the qualifier isn't defined, it means it doesnt exist

        if ( !effectQualifier ) return;

        const { qualifier, prefix, converters } = effectQualifier;

        const transformation = constructTransformation({
          qualifier,
          prefix,
          value: effect[key],
          converters
        });

        if ( transformation ) {
          applied.push(transformation);
        }
      });
    });

    // Layer Flags
    // Add flags to the primary layer transformation segment

    layerFlags.forEach(flag => {
      if ( !supportedFlags.includes(flag) ) return;
      primary.push(`fl_${flag}`);
    });

    // Applied Flags
    // Add flags to the fl_layer_apply transformation segment

    appliedFlags.forEach(flag => {
      if ( !supportedFlags.includes(flag) ) return;
      applied.push(`fl_${flag}`);
    });

    // Text styling

    if ( hasText ) {
      if ( typeof text === 'string' ) {
        text = {
          ...DEFAULT_TEXT_OPTIONS,
          text
        }
      }

      const textTransformations: Array<string> = [];

      if ( typeof text === 'object' ) {
        interface TextOption extends Qualifier {
          key: string;
          value: any;
          order: number;
        }

        const textOptions: Array<TextOption> = Object.keys(text)
          .filter(key => objectHasKey(qualifiersText, key))
          .map(key => {
            const value = text && objectHasKey(text, key) && text[key];
            return {
              ...qualifiersText[key],
              key,
              value,
              order: qualifiersText[key].order || 99
            }
          });

        const sortedTextOptions = sortByKey(textOptions, 'order');

        for (const textOption of sortedTextOptions) {
          const { key, value, qualifier, location, converters } = textOption as TextOption;
          let textValue = value;

          converters?.forEach(({ test, convert }) => {
            if ( !test(value) ) return;
            textValue = convert(value);
          })

          if ( location === 'primary' ) {
            primary.push(`${qualifier}_${textValue}`);
          } else if ( qualifier === 'self' ) {
            textTransformations.push(key);
          } else if ( qualifier ) {
            textTransformations.push(`${qualifier}_${textValue}`);
          } else {
            textTransformations.push(textValue);
          }
        }
      }

      const specialCharacters: Record<string, string> = {
        '.': '%2E',
        ',': '%2C',
        '/': '%2F',
      }

      let layerText = text?.text || '';

      if ( typeof layerText === 'string' ) {
        (Object.keys(specialCharacters) as Array<keyof typeof specialCharacters>)?.forEach((character: string) => {
          layerText = layerText?.replace(character, specialCharacters[character]);
        })
      }

      layerTransformation = `${layerTransformation}:${textTransformations.join('_')}:${layerText}`;
    }

    // Positioning

    if ( hasPosition ) {
      Object.keys(position).forEach(key => {
        if ( !objectHasKey(qualifiersPosition, key) ) return;

        const { qualifier, converters } = qualifiersPosition[key];

        const transformation = constructTransformation({
          qualifier,
          value: position[key],
          converters
        });

        if ( transformation ) {
          applied.push(transformation);
        }
      });
    }

    // Add all primary transformations

    if ( primary.length > 0 ) {
      layerTransformation = `${layerTransformation},${primary.join(',')}`;
    }

    // Add all applied transformations

    layerTransformation = `${layerTransformation}/fl_layer_apply,fl_no_overflow`;

    if ( applied.length > 0 ) {
      layerTransformation = `${layerTransformation},${applied.join(',')}`;
    }

    // Finally add it to the image

    cldAsset.addTransformation(layerTransformation);
  }

  return {};
}