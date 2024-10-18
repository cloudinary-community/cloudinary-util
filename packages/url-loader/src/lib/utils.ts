/** Safer alternative to Array.isArray that...
 * - doesn't narrow to any[]
 * - works with readonly arrays
 */
export const isArray: (data: unknown) => data is ReadonlyArray<unknown> =
  Array.isArray;

/**
 * extracts entries mimicking Object.entries, accounting for whether the
 * object is an array
 */
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
