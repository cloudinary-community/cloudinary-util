/**
 * encodeBase64
 * @description Universally returns a base64 encoded string
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
 * @description Helper function to check if a key exists on an object
 */

export function objectHasKey<T>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}