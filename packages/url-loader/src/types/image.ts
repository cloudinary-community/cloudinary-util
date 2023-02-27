export interface ImageOptionsResize {
  crop?: string;
  width?: number | string;
}
export interface ImageOptionsZoomPan {
  loop: string | boolean;
  options: string;
}

export interface ImageOptions {
  assetType?: string;
  crop?: string;
  deliveryType?: string;
  effects?: Array<any>;
  format?: string;
  gravity?: string;
  height?: string | number;
  overlays?: Array<any>;
  quality?: number;
  rawTransformations?: string[];
  removeBackground?: boolean;
  sanitize?: boolean;
  resize?: ImageOptionsResize;
  seoSuffix?: string;
  src: string;
  text?: any;
  transformations?: Array<string>;
  underlay?: string;
  underlays?: Array<any>;
  version?: number | string;
  width?: string | number;
  widthResize?: string;
  zoom?: string;
  zoompan?: string | boolean | ImageOptionsZoomPan;
}
