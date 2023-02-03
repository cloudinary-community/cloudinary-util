const REGEX_VERSION = /\/v\d+\//;
const REGEX_URL = /https?:\/\/(?<host>[^\/]+)\/(?<cloudName>[^\/]+)\/(?<assetType>image|video|raw)\/(?<deliveryType>upload|fetch|private|authenticated|sprite|facebook|twitter|youtube|vimeo)\/?(?<signature>s\-\-[a-zA-Z0-9]+\-\-)?\/?(?<transformations>(?:[^_\/]+_[^,\/]+,?)*\/)+(?<version>v\d+|\w{1,2})\/(?<id>[^\.^\s]+)(?<format>\.[a-zA-Z0-9]+$)?$/;

/**
 * parseUrl
 * @description
 */

interface ParseUrl {
  assetType?: string;
  cloudName?: string;
  deliveryType?: string;
  format?: string;
  host?: string;
  id?: string;
  signature?: string;
  transformations?: Array<string>;
  version?: string;
}

export function parseUrl(src: string): ParseUrl | undefined {
  if ( typeof src !== 'string' ) {
    throw new Error(`Failed to parse URL: Invalid src of type ${typeof src}`);
  }

  const hasVersion = REGEX_VERSION.test(src);

  if ( !hasVersion ) {
    throw new Error(`Invalid src: Does not include version (Ex: /v1234/)`);
  }

  const results = src.match(REGEX_URL);

  const parts = {
    ...results?.groups,
    transformations: results?.groups?.transformations.split('/').filter(t => !!t)
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
  const { id } = parseUrl(src) || {};
  return id;
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