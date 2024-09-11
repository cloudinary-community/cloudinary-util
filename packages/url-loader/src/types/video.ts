import { z } from "zod";
import type { Preserve } from "../lib/utils.js";
import { abrProps } from "../plugins/abr.js";
import { assetOptionsSchema } from "./asset.js";

export const videoOptionsSchema = assetOptionsSchema.merge(
  z.object({
    // Spreading plugins instead of extend or merge to avoid excessive schema warning
    // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
    ...abrProps,
  })
);

const { _output } = assetOptionsSchema;

export interface VideoOptions extends Preserve<typeof _output> {}
