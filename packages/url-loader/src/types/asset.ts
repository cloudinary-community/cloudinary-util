import { z } from "zod";
import { croppingProps } from "../plugins/cropping";
import { effectsProps } from "../plugins/effects";
import { flagsProps } from "../plugins/flags";
import { namedTransformationsProps } from "../plugins/named-transformations";
import { overlaysProps } from "../plugins/overlays";
import { rawTransformationsProps } from "../plugins/raw-transformations";
import { removeBackgroundProps } from "../plugins/remove-background";
import { sanitizeProps } from "../plugins/sanitize";
import { seoProps } from "../plugins/seo";
import { underlaysProps } from "../plugins/underlays";
import { versionProps } from "../plugins/version";

// Asset Options

export const assetOptionsSchema = z.object({
  assetType: z
    .string()
    .default("image")
    .describe(
      JSON.stringify({
        text: "The type of asset to deliver.",
        url: "https://cloudinary.com/documentation/image_transformations#transformation_url_structure",
      })
    )
    .optional(),
  deliveryType: z
    .string()
    .default("upload")
    .describe(
      JSON.stringify({
        text: "Delivery method of the asset.",
        url: "https://cloudinary.com/documentation/image_transformations#delivery_types",
      })
    )
    .optional(),
  dpr: z
    .union([z.string(), z.number()])
    .describe(
      JSON.stringify({
        text: "Delivery method of the asset.",
        url: "https://cloudinary.com/documentation/image_transformations#delivery_types",
      })
    )
    .optional(),
  format: z
    .string()
    .default("auto")
    .describe(
      JSON.stringify({
        text: "Converts (if necessary) and delivers an asset in the specified format.",
        url: "https://cloudinary.com/documentation/transformation_reference#f_format",
      })
    )
    .optional(),
  height: z
    .union([z.string(), z.number()])
    .describe(
      JSON.stringify({
        text: "Height of the given asset.",
      })
    )
    .optional(),
  quality: z
    .union([z.string(), z.number(), z.string()])
    .default("auto")
    .describe(
      JSON.stringify({
        text: "Quality of the delivered asset",
        url: "https://cloudinary.com/documentation/transformation_reference#q_quality",
      })
    )
    .optional(),
  src: z.string().describe(
    JSON.stringify({
      text: "Cloudinary Public ID or versioned Cloudinary URL (/v1234/)",
    })
  ),
  strictTransformations: z
    .boolean()
    .describe(
      JSON.stringify({
        text: "Gives you the ability to have more control over what transformations are permitted to be used from your Cloudinary account.",
        url: "https://cloudinary.com/documentation/control_access_to_media#strict_transformations",
      })
    )
    .optional(),
  width: z
    .union([z.string(), z.number()])
    .describe(
      JSON.stringify({
        text: "Width of the given asset.",
      })
    )
    .optional(),

  // Spreading plugins instead of extend or merge to avoid excessive schema warning
  // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
  ...croppingProps,
  ...effectsProps,
  ...flagsProps,
  ...namedTransformationsProps,
  ...overlaysProps,
  ...rawTransformationsProps,
  ...removeBackgroundProps,
  ...sanitizeProps,
  ...seoProps,
  ...underlaysProps,
  ...versionProps,
});

type _AssetOptions = z.infer<typeof assetOptionsSchema>;

export interface AssetOptions extends _AssetOptions {}
