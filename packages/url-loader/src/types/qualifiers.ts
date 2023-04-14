export interface QualiferConverters {
  test: Function;
  convert: Function;
}

export interface Qualifier {
  location?: string;
  order?: number;
  prefix?: string;
  qualifier?: string | boolean;
  converters?: Array<QualiferConverters>
}