import { z } from 'zod';

import { PluginSettings } from '../types/plugins';

import { flags as qualifiersFlags } from '../constants/qualifiers';

export const pluginProps = {
  // @todo: can / should this be an enum?
  flags: z.union([
      z.array(z.string()),
      z.string()
    ])
    .describe(JSON.stringify({
      text: 'Alters the regular behavior of another transformation or the overall delivery behavior.',
      url: 'https://cloudinary.com/documentation/transformation_reference#fl_flag'
    }))
    .optional()
};

export const assetTypes = ['image', 'images', 'video', 'videos']

// @todo can this be a validation check as part of Zod?
const supportedFlags = Object.entries(qualifiersFlags).map(([_, { qualifier }]) => qualifier);

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { flags = [] } = options;

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