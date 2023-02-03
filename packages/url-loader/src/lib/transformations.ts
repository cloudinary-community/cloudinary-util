/**
 * constructTransformation
 * @description Constructs a transformation string to append to a URL
 * @param {object} settings: Configuration including prefix, qualifier, and value
 */

interface ConstructTransformationSettings {
  prefix?: string;
  qualifier?: string | boolean;
  value?: string | boolean;
}

export function constructTransformation({ prefix, qualifier, value }: ConstructTransformationSettings) {
  let transformation = '';

  if ( prefix ) {
    transformation = `${prefix}_`;
  }

  if ( value === true || value === 'true' ) {
    return `${transformation}${qualifier}`;
  }

  if ( typeof value === 'string' || typeof value === 'number' ) {
    if ( prefix ) {
      return `${transformation}${qualifier}:${value}`;
    } else {
      return `${qualifier}_${value}`;
    }
  }
}