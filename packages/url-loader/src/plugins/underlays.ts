import { objectHasKey } from '@cloudinary-util/util';

import { PluginSettings } from '../types/plugins';

import {
  flags as qualifiersFlags,
  primary as qualifiersPrimary,
  position as qualifiersPosition
} from '../constants/qualifiers';

export const props = ['underlay', 'underlays'];

export function plugin(props: PluginSettings) {
  const { cldImage, options } = props;
  const { underlay, underlays = [] } = options;

  const typeQualifier = 'u';

  if ( Array.isArray(underlays) ) {
    underlays.forEach(applyUnderlay);
  }

  if ( typeof underlay === 'string' ) {
    const underlayOptions: ApplyUnderlaySettings = {
      publicId: underlay,
      crop: 'fill',
      width: '1.0',
      height: '1.0',
      flags: ['relative']
    }

    applyUnderlay(underlayOptions);
  }

  /**
   * applyUnderlay
   */

  interface ApplyUnderlaySettings {
    appliedEffects?: Array<object>
    effects?: Array<object>;
    crop?: string;
    flags?: Array<string>;
    height?: string | number;
    position?: string;
    publicId?: string;
    type?: string;
    url?: string;
    width?: string | number;
  }

  function applyUnderlay({ publicId, type, position, effects: layerEffects = [], flags = [], ...options }: ApplyUnderlaySettings) {
    const hasPublicId = typeof publicId === 'string';
    const hasPosition = typeof position === 'object';

    if ( !hasPublicId ) {
      console.warn(`An ${type} is missing a Public ID`);
      return;
    }

    // Start to construct the transformation string using the public ID

    let layerTransformation = `${typeQualifier}_${publicId.replace(/\//g, ':')}`;

    // Begin organizing transformations based on what it is and the location
    // it needs to be placed in the URL

    const primary: Array<string> = [];
    const applied: Array<string> = [];

    // Gemeral options

    (Object.keys(options) as Array<keyof typeof options>).forEach(key => {
      if ( !objectHasKey(qualifiersPrimary, key) ) return;
      const { qualifier } = qualifiersPrimary[key];
      primary.push(`${qualifier}_${options[key]}`);
    });

    // Layer effects

    layerEffects.forEach(effect => {
      (Object.keys(effect) as Array<keyof typeof effect>).forEach(key => {
        if ( !objectHasKey(qualifiersPrimary, key) ) return;
        const { qualifier } = qualifiersPrimary[key];
        primary.push(`${qualifier}_${effect[key]}`);
      });
    });

    // Positioning

    if ( hasPosition ) {
      (Object.keys(position) as Array<keyof typeof position>).forEach(key => {
        if ( !objectHasKey(qualifiersPosition, key) ) return;
        const { qualifier } = qualifiersPosition[key as string];
        applied.push(`${qualifier}_${position[key]}`);
      });
    }

    // Positioning

    flags.forEach(key => {
      if ( !objectHasKey(qualifiersFlags, key) ) return;
      const { qualifier, prefix } = qualifiersFlags[key];
      primary.push(`${prefix}_${qualifier}`);
    });

    // Add all primary transformations

    layerTransformation = `${layerTransformation},${primary.join(',')}`;

    // Add all applied transformations

    layerTransformation = `${layerTransformation}/fl_layer_apply,fl_no_overflow`;

    if ( applied.length > 0 ) {
      layerTransformation = `${layerTransformation},${applied.join(',')}`;
    }

    // Finally add it to the image

    cldImage.addTransformation(layerTransformation);
  }

  return {};
}