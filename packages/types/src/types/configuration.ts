// From @cloudinary/url-gen/config/interfaces/Config/ICloudinaryCloudinaryAssetConfigurations

export interface CloudinaryAssetConfigurationAuthToken {
  token_name: string;
  duration: string;
  start_time: string;
  expiration: string;
  ip: string;
  acl: string;
  url: string;
  key: string;
}

export interface CloudinaryAssetConfigurationUrl {
  cname?: string;
  secureDistribution?: string;
  privateCdn?: boolean;
  secure?: boolean;
  analytics?: boolean;
  signUrl?: boolean;
  longUrlSignature?: boolean;
  shorten?: boolean;
  useRootPath?: boolean;
  forceVersion?: boolean;
  queryParams?: Record<string, string | number | boolean> | string;
};

export interface CloudinaryAssetConfigurationCloud {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  authToken?: CloudinaryAssetConfigurationAuthToken;
};

export interface CloudinaryAssetConfiguration {
  cloud?: CloudinaryAssetConfigurationCloud;
  url?: CloudinaryAssetConfigurationUrl;
}