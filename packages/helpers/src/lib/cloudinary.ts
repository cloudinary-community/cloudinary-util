const regexWithTransformations = /(https?)\:\/\/(res.cloudinary.com)\/([^\/]+)\/(image|video|raw)\/(upload|authenticated)\/(.*)\/(v[0-9]+)\/(.+)(?:\.[a-z]{3})?/;
const regexWithoutTransformations = /(https?)\:\/\/(res.cloudinary.com)\/([^\/]+)\/(image|video|raw)\/(upload|authenticated)\/(v[0-9]+)\/(.+)(?:\.[a-z]{3})?/;

const regexTransformations = new RegExp(
  "(https?)://(res.cloudinary.com)/([^/]+)/(image|video|raw)/(upload|authenticated)/(.*)/(v[0-9]+)/(.+)(?:.[a-z]{3})?",
  "gi"
);

/**
 * Retrieves the public id of a cloudiary image url. If no url is recognized it returns the parameter it self.
 * If it's recognized that is a url and it's not possible to get the public id, it warns the user.
 *
 * @param {string} src The cloudiary url or public id.
 *
 * @return {string} The images public id
 */

export function getPublicId(src: string): string {
  if ( typeof src !== 'string' ) {
    throw new Error(`Invalid src of type ${typeof src}`);
  }

  if ( src.includes('res.cloudinary.com') ) {


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
 * Retrieves the transformations added to a cloudiary image url. If no transformation is recognized it returns an empty array.
 *
 * @param {string} src The cloudiary url.
 *
 * @return {array} The array of transformations
 */

export function getTransformations(src: string, preserveTransformations: boolean) {
  if (typeof src !== "string") {
    throw new Error(`Invalid src of type ${typeof src}`);
  }

  if (src.includes("res.cloudinary.com") && preserveTransformations) {
    const groups = regexTransformations.exec(src);
    const transformationStr = groups?.slice(1).find((i) => i.includes("_"));

    if (transformationStr) {
      return transformationStr.split(",").join("/").split("/");
    } else {
      return [];
    }
  }

  return [];
}