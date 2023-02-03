export interface ImageOptionsResize {
  crop?: string;
  width?: number | string;
}
export interface ImageOptionsZoomPan {
  loop: string | boolean;
  options: string;
}

export interface ImageOptions {
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
  resize?: ImageOptionsResize;
  src: string;
  text?: any;
  transformations?: Array<string>;
  underlay?: string;
  underlays?: Array<any>;
  width?: string | number;
  widthResize?: string;
  zoom?: string;
  zoompan?: string | boolean | ImageOptionsZoomPan;
}

