import { QualiferConverters } from "../types/qualifiers";

/**
 * constructTransformation
 * @description Constructs a transformation string to append to a URL
 * @param {object} settings: Configuration including prefix, qualifier, and value
 */

interface ConstructTransformationSettings {
  prefix?: string;
  qualifier?: string | boolean;
  value?: string | number | boolean;
  converters?: Array<QualiferConverters>;
}

export function constructTransformation({ prefix, qualifier, value, converters }: ConstructTransformationSettings) {
  let transformation = '';

  if ( prefix ) {
    transformation = `${prefix}_`;
  }

  let transformationValue = value;

  converters?.forEach(({ test, convert }) => {
    if ( !test(transformationValue) ) return;
    transformationValue = convert(transformationValue);
  })

  if ( transformationValue === true || transformationValue === 'true' ) {
    return `${transformation}${qualifier}`;
  }

  if ( typeof transformationValue === 'string' || typeof transformationValue === 'number' ) {
    if ( prefix ) {
      return `${transformation}${qualifier}:${transformationValue}`;
    } else {
      return `${qualifier}_${transformationValue}`;
    }
  }
}


/**
 * promptArrayToString
 */

export function promptArrayToString(promptArray: Array<string>) {
  return `(${promptArray.join(';')})`;
}