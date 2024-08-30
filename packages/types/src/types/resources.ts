export type CloudinaryResourceAccessMode = "public" | "authenticated" | (string & {});
export type CloudinaryResourceResourceType = "image" | "video" | "raw" | "auto";
export type CloudinaryResourceType = "upload" | "private" | "authenticated";

export interface CloudinaryResource {
  access_control: Array<string>;
  access_mode: CloudinaryResourceAccessMode;
  asset_id: string;
  bytes: number;
  context: Record<string, Record<string, string>>;
  colors?: [string, number][];
  created_at: string;
  display_name: string;
  folder: string;
  format: string;
  height: number;
  info: Record<string, unknown>;
  metadata: Record<string, Record<string, string>>;
  moderation: Array<string>;
  public_id: string;
  resource_type: CloudinaryResourceResourceType;
  secure_url: string;
  signature: string;
  tags: Array<string>;
  type: CloudinaryResourceType;
  url: string;
  version: number;
  width: number;
  [key: string]: unknown;
}