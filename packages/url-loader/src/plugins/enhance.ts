import { z } from "zod";
import { ImageOptions } from "../types/image";
import { type TransformationPlugin } from "../types/plugins";

export const enhanceProps = {
  enhance: z
    .boolean()
    .describe(
      JSON.stringify({
        text: "Uses AI to analyze an image and make adjustments to enhance the appeal of the image.",
        url: "https://cloudinary.com/documentation/transformation_reference#e_enhance",
      })
    )
    .optional(),
};

export const enhancePlugin = {
  props: enhanceProps,
  assetTypes: ["image", "images"],
  plugin: (settings) => {
    const { cldAsset, options } = settings;
    const { enhance = false } = options;

    if (enhance) {
      cldAsset.effect("e_enhance");
    }

    return {};
  },
} satisfies TransformationPlugin<ImageOptions>;
