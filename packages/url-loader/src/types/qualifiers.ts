export interface QualifierConverters {
  convert: (value: any) => unknown;
  test: (value: any) => boolean;
}

export interface QualifierConfig {
  location?: string;
  order?: number;
  prefix?: string;
  qualifier?: string | boolean;
  converters?: ReadonlyArray<QualifierConverters>;
}
