import type { TransformationPlugin } from "../types/plugins.js";

export interface NamedTransformationsOptions {
  /**
   * @description Named transformations to apply to asset.
   * @url https://cloudinary.com/documentation/image_transformations#named_transformations
   */
  namedTransformations?: string | readonly string[];
  /**
   * @deprecated use {@link `namedTransformations`} instead
   * @description: Deprecated: use namedTransformations instead
   * @url https://cloudinary.com/documentation/image_transformations#named_transformations
   */
  transformations?: string | readonly string[];
}

export const namedTransformationsPlugin = {
  strict: true,
  assetTypes: ["image", "images", "video", "videos"],
  plugin: ({ cldAsset, options }) => {
    const { transformations, namedTransformations } = options;

    if (transformations && process.env.NODE_ENVIRONMENT === "development") {
      console.warn(
        "The transformations prop is deprecated. Please use namedTransformations instead."
      );
    }

    let _namedTransformations = namedTransformations || transformations || [];

    if (!Array.isArray(_namedTransformations)) {
      _namedTransformations = [_namedTransformations];
    }

    _namedTransformations.forEach((transformation: string) => {
      cldAsset.addTransformation(`t_${transformation}`);
    });

    return {};
  },
} satisfies TransformationPlugin;
