const REGEX_VERSION = /\/v\d+\//;
const REGEX_FORMAT = /\.(ai|avif|gif|png|webp|bmp|bw|djvu|dng|ps|ept|eps|eps3|fbx|flif|gif|glb|gltf|heif|heic|ico|indd|jpg|jpe|jpeg|jp2|wdp|jxr|hdp|obj|pdf|ply|png|psd|arw|cr2|svg|tga|tif|tiff|u3ma|usdz|webp|3g2|3gp|avi|flv|m3u8|ts|m2ts|mts|mov|mkv|mp4|mpeg|mpd|mxf|ogv|webm|wmv)$/i
const REGEX_URL = /https?:\/\/(?<host>[^\/]+)\/(?<cloudName>[^\/]+)\/(?<assetType>image|images|video|videos|raw|files)\/(?<deliveryType>upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)?\/?(?<signature>s--([a-zA-Z0-9\_\-]{8}|[a-zA-Z0-9\_\-]{32})--)?\/?(?<transformations>(?:[^_\/]+_[^,\/]+,?\/?)*\/)*(?<version>v\d+|\w{1,2})\/(?<publicId>[^\s]+)$/;
const ASSET_TYPES_SEO = ['images', 'videos', 'files'];


/**
 * parseUrl
 * @description
 */

export interface ParseUrl {
  assetType?: string;
  cloudName?: string;
  deliveryType?: string;
  format?: string;
  host?: string;
  publicId?: string;
  signature?: string;
  seoSuffix?: string;
  transformations?: Array<string>;
  queryParams?: object;
  version?: number;
}

export function parseUrl(src: string): ParseUrl | undefined {
  if ( typeof src !== 'string' ) {
    throw new Error(`Failed to parse URL: Invalid src of type ${typeof src}`);
  }

  const hasVersion = REGEX_VERSION.test(src);

  if ( !hasVersion ) {
    throw new Error(`Invalid src: Does not include version (Ex: /v1234/)`);
  }

  const [baseUrlWithExtension, queryString] = src.split('?');

  const formatMatches = baseUrlWithExtension.match(REGEX_FORMAT);

  let baseUrl = baseUrlWithExtension;
  let format;

  if ( formatMatches !== null ) {
    format = `${formatMatches[0]}`;
    baseUrl = baseUrlWithExtension.replace(new RegExp(`${format}$`), '');
  }

  const results = baseUrl.match(REGEX_URL);

  const transformations = results?.groups?.transformations?.split('/').filter(t => !!t);

  const parts: ParseUrl = {
    ...results?.groups,
    format,
    seoSuffix: undefined,
    transformations: transformations || [],
    queryParams: {},
    version: results?.groups?.version ? parseInt(results.groups.version.replace('v', '')) : undefined
  }

  if ( queryString ) {
    interface QueryParams {
      [key: string]: string | undefined;
    }

    parts.queryParams = queryString.split('&').reduce((prev: QueryParams, curr: string) => {
      const [key, value] = curr.split('=');
      prev[key] = value;
      return prev;
    }, {});
  }

  if ( parts.assetType && ASSET_TYPES_SEO.includes(parts.assetType) ) {
    const publicIdParts = parts.publicId?.split('/') || [];
    parts.seoSuffix = publicIdParts.pop();
    parts.publicId = publicIdParts.join('/');
  }

  return parts;
}


/**
 * getPublicId
 * @description Retrieves the public id of a cloudiary image url. If no url is recognized it returns the parameter it self.
 * If it's recognized that is a url and it's not possible to get the public id, it warns the user.
 * @param {string} src: The cloudiary url or public id.
 */

export function getPublicId(src: string): string | undefined {
  const { publicId } = parseUrl(src) || {};
  return publicId;
}


/**
 * getTransformations
 * @description Retrieves the transformations added to a Cloudinary image url. If no transformation is recognized it returns an empty array.
 * @param {string} src: The cloudiary url
 */

export function getTransformations(src: string) {
  const { transformations = [] } = parseUrl(src) || {};
  return transformations.map(t => t.split(','));
}