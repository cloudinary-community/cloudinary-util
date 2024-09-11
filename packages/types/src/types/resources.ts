export type CloudinaryResourceAccessMode = "public" | "authenticated" | (string & {});
export type CloudinaryResourceResourceType = "image" | "video" | "raw" | "auto" | (string & {});
export type CloudinaryResourceDeliveryType =
  | "animoto"
  | "asset"
  | "authenticated"
  | "dailymotion"
  | "facebook"
  | "fetch"
  | "gravatar"
  | "hulu"
  | "instagram"
  | "list"
  | "multi"
  | "private"
  | "text"
  | "twitter"
  | "twitter_name"
  | "upload"
  | "vimeo"
  | "worldstarhiphop"
  | "youtube"
  | (string & {});

export interface CloudinaryResourceContext {
  custom?: {
    alt?: string;
    caption?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface CloudinaryResource {
  access_control?: Array<string>;
  access_mode?: CloudinaryResourceAccessMode;
  asset_id: string;
  backup?: boolean;
  bytes: number;
  context?: CloudinaryResourceContext;
  colors?: [string, number][];
  coordinates?: object;
  created_at: string;
  derived?: Array<string>;
  display_name?: string;
  exif?: object;
  faces?: number[][];
  folder: string;
  format: string;
  height: number;
  image_metadata?: object;
  info?: object;
  media_metadata?: object;
  metadata?: object;
  moderation?: object | Array<string>;
  pages?: number;
  phash?: string;
  placeholder?: boolean;
  predominant?: object;
  public_id: string;
  quality_analysis?: number;
  resource_type: CloudinaryResourceResourceType;
  secure_url: string;
  signature?: string;
  tags?: Array<string>;
  type: CloudinaryResourceDeliveryType;
  url: string;
  version: number;
  width: number;
  [key: string]: unknown;
}