import { z } from 'zod';

import { assetOptionsSchema } from './asset';

import { pluginProps as abrPluginProps } from '../plugins/abr';

export const videoOptionsSchema = assetOptionsSchema.merge(z.object({
  // Spreading plugins instead of extend or merge to avoid excessive schema warning
  // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
  ...abrPluginProps,
}))

export type VideoOptions = z.infer<typeof videoOptionsSchema>;