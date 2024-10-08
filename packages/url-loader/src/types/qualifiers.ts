export interface QualifierConverters {
  convert: (value: unknown) => unknown;
  test: (value: unknown) => boolean;
}

export interface Qualifier {
  location?: string;
  order?: number;
  prefix?: string;
  qualifier?: string | boolean;
  converters?: readonly QualifierConverters[];
}
