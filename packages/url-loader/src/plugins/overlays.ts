import { encodeBase64, objectHasKey, sortByKey } from '@cloudinary-util/util';

import { PluginSettings } from '../types/plugins';
import { Qualifier } from '../types/qualifiers';

import { constructTransformation } from '../lib/transformations';

import {
  effects as qualifiersEffects,
  position as qualifiersPosition,
  primary as qualifiersPrimary,
  text as qualifiersText,
} from '../constants/qualifiers';

export const props = ['text', 'overlays'];
export const assetTypes = ['image', 'images', 'video', 'videos'];

export const DEFAULT_TEXT_OPTIONS = {
  color: 'black',
  fontFamily: 'Arial',
  fontSize: 200,
  fontWeight: 'bold',
};

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
      text: {
        ...DEFAULT_TEXT_OPTIONS,
        text
      }
    })
  } else if ( typeof text === 'object' ) {
    applyOverlay({
      text: {
        ...DEFAULT_TEXT_OPTIONS,
        ...text
      }
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
    appliedEffects?: Array<object>
    effects?: Array<object>;
    position?: string;
    publicId?: string;
    text?: string | ApplyOverlaySettingsText;
    url?: string;
  }

  function applyOverlay({ publicId, url, position, text, effects: layerEffects = [], appliedEffects = [], ...options }: ApplyOverlaySettings) {
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
        const { qualifier, prefix, converters } = qualifiersPrimary[key] || qualifiersEffects[key] || {};

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
        const { qualifier, prefix, converters } = qualifiersPrimary[key] || qualifiersEffects[key] || {};

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