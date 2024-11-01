import type { ConstructTransformationSettings } from "../lib/transformations.js";

export interface QualifierConverters {
  convert: (value: any) => ConstructTransformationSettings["value"];
  test: (value: any) => boolean;
}

export interface QualifierConfig {
  location?: string;
  order?: number;
  prefix?: string;
  qualifier?: string | boolean;
  converters?: ReadonlyArray<QualifierConverters>;
}
