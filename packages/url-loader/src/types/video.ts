import { z } from "zod";
import { abrProps } from "../plugins/abr.js";
import { assetOptionsSchema } from "./asset.js";

export const videoOptionsSchema = assetOptionsSchema.merge(
  z.object({
    // Spreading plugins instead of extend or merge to avoid excessive schema warning
    // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
    ...abrProps,
  })
);

// declare const videoOptions: typeof videoOptionsSchema._output;

export type VideoOptions = typeof videoOptionsSchema._output;
