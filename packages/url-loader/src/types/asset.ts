export interface AssetOptionsResize {
  crop?: string;
  width?: number | string;
}

export interface AssetOptions {
  assetType?: string;
  crop?: string;
  deliveryType?: string;
  dpr?: number | string;
  effects?: Array<any>;
  flags?: Array<string> | object;
  format?: string;
  gravity?: string;
  height?: string | number;
  overlays?: Array<any>;
  quality?: number | string;
  rawTransformations?: string[];
  removeBackground?: boolean;
  sanitize?: boolean;
  resize?: AssetOptionsResize;
  seoSuffix?: string;
  strictTransformations?: boolean;
  src: string;
  text?: any;
  transformations?: Array<string>;
  underlay?: string;
  underlays?: Array<any>;
  version?: number | string;
  width?: string | number;
  widthResize?: string | number;
  zoom?: string;
}
