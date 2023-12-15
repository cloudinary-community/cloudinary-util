import { z } from 'zod';

import { assetOptionsSchema } from './asset';

import { pluginProps as defaultImagePluginProps } from '../plugins/default-image';
import { pluginProps as fillBackgroundPluginProps } from '../plugins/fill-background';
import { pluginProps as recolorPluginProps } from '../plugins/recolor';
import { pluginProps as removePluginProps } from '../plugins/remove';
import { pluginProps as restorePluginProps } from '../plugins/restore';
import { pluginProps as replacePluginProps } from '../plugins/replace';
import { pluginProps as zoompanPluginProps } from '../plugins/zoompan';

export const imageOptionsSchema = assetOptionsSchema
  .merge(z.object(defaultImagePluginProps))
  .merge(z.object(fillBackgroundPluginProps))
  .merge(z.object(recolorPluginProps))
  .merge(z.object(removePluginProps))
  .merge(z.object(replacePluginProps))
  .merge(z.object(restorePluginProps))
  .merge(z.object(zoompanPluginProps))

export type ImageOptions = z.infer<typeof imageOptionsSchema>;