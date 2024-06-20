import { z } from "zod";
import { assetOptionsSchema } from "./asset";
import { defaultImageProps } from "../plugins/default-image";
import { enhanceProps } from "../plugins/enhance";
import { fillBackgroundProps } from "../plugins/fill-background";
import { recolorProps } from "../plugins/recolor";
import { removeProps } from "../plugins/remove";
import { replaceProps } from "../plugins/replace";
import { restoreProps } from "../plugins/restore";
import { zoompanProps } from "../plugins/zoompan";

export const imageOptionsSchema = assetOptionsSchema.merge(
  z.object({
    // Spreading plugins instead of extend or merge to avoid excessive schema warning
    // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
    ...defaultImageProps,
    ...enhanceProps,
    ...fillBackgroundProps,
    ...recolorProps,
    ...removeProps,
    ...replaceProps,
    ...restoreProps,
    ...zoompanProps,
  })
);

type _ImageOptions = z.infer<typeof imageOptionsSchema>;

export interface ImageOptions extends _ImageOptions {}
