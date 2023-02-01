/**
 * getPublicId
 * @description Retrieves the public id of a cloudiary image url. If no url is recognized it returns the parameter it self.
 * If it's recognized that is a url and it's not possible to get the public id, it warns the user.
 * @param {string} src The cloudiary url or public id.
 */

export function getPublicId(src: string): string {
  if ( typeof src !== 'string' ) {
    throw new Error(`Invalid src of type ${typeof src}`);
  }

  if ( src.includes('res.cloudinary.com') ) {
    const regexWithTransformations = /(https?)\:\/\/(res.cloudinary.com)\/([^\/]+)\/(image|video|raw)\/(upload|authenticated)\/(.*)\/(v[0-9]+)\/(.+)(?:\.[a-z]{3})?/
    const regexWithoutTransformations = /(https?)\:\/\/(res.cloudinary.com)\/([^\/]+)\/(image|video|raw)\/(upload|authenticated)\/(v[0-9]+)\/(.+)(?:\.[a-z]{3})?/

    const withTransformations = src.match(regexWithTransformations)
    const withoutTransformations = src.match(regexWithoutTransformations)

    if ( withTransformations ) {
      return withTransformations[withTransformations.length - 1]
    } else if ( withoutTransformations ) {
      return withoutTransformations[withoutTransformations.length - 1]
    } else {
      console.warn(`Not possible to retrieve the publicUrl from ${src}, make sure it's a valid cloudinary image url.`)
    }
  }

  return src;
}


/**
 * getTransformations
 * @description Retrieves the transformations added to a cloudiary image url. If no transformation is recognized it returns an empty array.
 * @param {string} The cloudiary url
 * @return {boolean} Preserve the existing transformations when parsing
 */

export function getTransformations(src: string, preserveTransformations: boolean) {
  if (typeof src !== "string") {
    throw new Error(`Invalid src of type ${typeof src}`);
  }

  if (src.includes("res.cloudinary.com") && preserveTransformations) {
    const regex = new RegExp(
      "(https?)://(res.cloudinary.com)/([^/]+)/(image|video|raw)/(upload|authenticated)/(.*)/(v[0-9]+)/(.+)(?:.[a-z]{3})?",
      "gi"
    );
    const groups = regex.exec(src);
    const transformationStr = groups?.slice(1).find((i) => i.includes("_"));

    if (transformationStr) {
      return transformationStr.split(",").join("/").split("/");
    } else {
      return [];
    }
  }

  return [];
}