import { z } from "zod";
import type { Preserve } from "../lib/utils.js";

export const qualifierConvertersSchema = z.object({
  convert: z.function().args(z.any()).returns(z.any()),
  test: z.function().args(z.any()).returns(z.boolean()),
});

export type QualiferConverters = z.infer<typeof qualifierConvertersSchema>;

export const qualifierSchema = z.object({
  location: z.string().optional(),
  order: z.number().optional(),
  prefix: z.string().optional(),
  qualifier: z.union([z.string(), z.boolean()]).optional(),
  converters: z.array(qualifierConvertersSchema).optional(),
  schema: z.any(),
});

const { _output } = qualifierSchema;

export interface Qualifier extends Preserve<typeof _output> {}
