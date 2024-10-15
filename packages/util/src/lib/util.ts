/**
 * encodeBase64
 * @description Universally returns a base64 encoded string
 * @param {any} value: The value to encode as a string
 */
export function encodeBase64(value: any) {
  if (typeof btoa === "function") {
    return btoa(value);
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(value).toString("base64");
  }
}

/**
 * objectHasKey
 * @description Helper function to check if a key exists on an object
 * @param {object} obj: The object to check
 * @param {string} key: The key to check against the object
 */

export function objectHasKey<T>(obj: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * sortByKey
 * @description Sort the given array by the key of an object
 */

export function sortByKey(
  array: Array<object> = [],
  key: string,
  type: string = "asc"
) {
  function compare(a: any, b: any) {
    let keyA = a[key];
    let keyB = b[key];

    if (typeof keyA === "string") {
      keyA = keyA.toLowerCase();
    }

    if (typeof keyB === "string") {
      keyB = keyB.toLowerCase();
    }

    if (keyA < keyB) return -1;

    if (keyA > keyB) return 1;

    return 0;
  }

  let newArray = [...array];

  if (typeof key !== "string") return newArray;

  newArray = newArray.sort(compare);

  if (type === "desc") {
    return newArray.reverse();
  }

  return newArray;
}

export const isArray: (data: unknown) => data is ReadonlyArray<unknown> =
  Array.isArray;

// extracts entries mimicking Object.entries, accounting for whether the
// object is an array
export type entryOf<o> = {
  [k in keyof o]-?: [k, o[k] & ({} | null)];
}[o extends ReadonlyArray<unknown> ? keyof o & number : keyof o] &
  unknown;

/**
 * Object.entries wrapper providing narrowed types for objects with known sets
 * of keys, e.g. those defined internally as configs
 *
 * @param o the object to get narrowed entries from
 * @returns a narrowed array of entries based on that object's type
 */
export const entriesOf: <o extends object>(o: o) => entryOf<o>[] =
  Object.entries as never;

/**
 * Throws an error with the specified message and constructor.
 *
 * @param {string} message - The error message.
 * @param {new (message: string) => Error} [ctor=Error] - The error constructor. Defaults to the built-in Error constructor.
 * @throws {Error} Throws an error with the specified message.
 */
export const throwError: (
  message: string,
  ctor?: new (message: string) => Error
) => never = (message, ctor = Error) => {
  throw new ctor(message);
};

/**
 * @description A primative value that can be interpolated into a string
 */
export type StringifiablePrimative = string | number | bigint | boolean;
