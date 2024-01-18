import { z } from 'zod';

import { assetOptionsSchema } from './asset';

import { props as defaultImagePluginProps } from '../plugins/default-image';
import { props as fillBackgroundPluginProps } from '../plugins/fill-background';
import { props as recolorPluginProps } from '../plugins/recolor';
import { props as removePluginProps } from '../plugins/remove';
import { props as restorePluginProps } from '../plugins/restore';
import { props as replacePluginProps } from '../plugins/replace';
import { props as zoompanPluginProps } from '../plugins/zoompan';

export const imageOptionsSchema = assetOptionsSchema.merge(z.object({
  // Spreading plugins instead of extend or merge to avoid excessive schema warning
  // https://github.com/microsoft/TypeScript/issues/34933#issuecomment-1772787785
  ...defaultImagePluginProps,
  ...fillBackgroundPluginProps,
  ...recolorPluginProps,
  ...removePluginProps,
  ...replacePluginProps,
  ...restorePluginProps,
  ...zoompanPluginProps,
}))

export type ImageOptions = z.infer<typeof imageOptionsSchema>;