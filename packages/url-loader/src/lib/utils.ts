import type { z } from "zod";

export type Preserve<T> = T;

/** Force an operation like `{ a: 0 } & { b: 1 }` to be computed so that it displays `{ a: 0; b: 1 }`. */
export type show<t> = { [k in keyof t]: t[k] } & unknown;

export const mergeSchemas = <base extends object, merged extends object>(
  base: z.ZodType<base>,
  merged: z.ZodType<merged>
): z.ZodType<show<Omit<base, keyof merged> & merged>> => {
  return (base as {} as z.AnyZodObject).merge(merged as never) as never;
};
