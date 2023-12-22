import { z } from 'zod';

import { assetOptionsSchema } from './asset';

import { pluginProps as defaultImagePluginProps } from '../plugins/default-image';
import { pluginProps as fillBackgroundPluginProps } from '../plugins/fill-background';
import { pluginProps as recolorPluginProps } from '../plugins/recolor';
import { pluginProps as removePluginProps } from '../plugins/remove';
import { pluginProps as restorePluginProps } from '../plugins/restore';
import { pluginProps as replacePluginProps } from '../plugins/replace';
import { pluginProps as zoompanPluginProps } from '../plugins/zoompan';

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