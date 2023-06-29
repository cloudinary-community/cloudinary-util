import { z } from 'zod';

import { PluginSettings } from '../types/plugins';

import { constructPluginSchema } from '../lib/plugins';
import { flags as qualifiersFlags } from '../constants/qualifiers';

const pluginProps = [
  {
    name: 'flags',
    type: z.union([
      z.array(z.string()),
      z.record(z.string(), z.string())
    ]).optional(),
    assetTypes: ['image', 'images', 'video', 'videos']
  }
];

const pluginPropsSchema = constructPluginSchema(pluginProps);

export const props = pluginProps.map(({ name }) => name);
export const assetTypes = Array.from(new Set(pluginProps.flatMap(({ assetTypes }) => assetTypes)));

const supportedFlags = Object.entries(qualifiersFlags).map(([_, { qualifier }]) => qualifier);

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { flags = [] } = options;

  const test = pluginPropsSchema.parse(options);
  console.log('test', test)

  // First iteration of adding flags follows the same pattern
  // as the top level option from Cloudinary URL Gen SDK where
  // each flag is individually added as its own segment via
  // the addFlag method. Flags can have additional context and
  // may warrant case-by-case applications

  if ( Array.isArray(flags) && flags.length > 0 ) {
    flags.forEach(flag => {
      if ( !supportedFlags.includes(flag) ) return;
      cldAsset.addFlag(flag)
    });
  } else if ( typeof flags === 'object' ) {
    Object.entries(flags).forEach(([qualifier, value]) => {
      if ( !supportedFlags.includes(qualifier) ) return;
      // The addFlag method encodes some characters, specifically
      // the "." character which breaks some use cases like
      // du_2.5
      cldAsset.addTransformation(`fl_${qualifier}:${value}`);
    });
  }

  return {};
}