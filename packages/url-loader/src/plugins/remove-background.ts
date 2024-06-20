import { z } from "zod";
import { ImageOptions } from "../types/image";
import { type TransformationPlugin } from "../types/plugins";

export const removeBackgroundProps = {
  removeBackground: z
    .boolean()
    .describe(
      JSON.stringify({
        text: "Removes the background of an image using the Cloudinary AI Background Removal Add-On (Required).",
        url: "https://cloudinary.com/documentation/cloudinary_ai_background_removal_addon",
      })
    )
    .optional(),
};

export const removeBackgroundPlugin = {
  props: removeBackgroundProps,
  assetTypes: ["image", "images"],
  plugin: (settings) => {
    const { cldAsset, options } = settings;
    const { removeBackground = false } = options;
    if (removeBackground) {
      cldAsset.effect("e_background_removal");
    }
    return {};
  },
} satisfies TransformationPlugin<ImageOptions>;
