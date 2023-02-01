/**
 * encodeBase64
 */

export function encodeBase64(value: any) {
  if ( typeof btoa === 'function' ) {
    return btoa(value);
  }

  if ( typeof Buffer !== 'undefined' ) {
    return Buffer.from(value).toString('base64');
  }
}

/**
 * objectHasKey
 */

export function objectHasKey<T>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}