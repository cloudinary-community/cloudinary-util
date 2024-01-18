import * as parameters from '../constants/parameters';

import { PluginSettings } from '../types/plugins';

const { flagsEnum } = parameters;

export const props = {
  flags: parameters.flags.schema.optional()
};

export const assetTypes = ['image', 'images', 'video', 'videos']

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
      const { success } = flagsEnum.safeParse(flag);
      
      if ( !success ) {
        if ( process.env.NODE_ENV === 'development' ) {
          console.warn(`Invalid flag ${flag}, not applying.`)
        }
        return;
      }

      cldAsset.addFlag(flag)
    });
  } else if ( typeof flags === 'object' ) {
    Object.entries(flags).forEach(([qualifier, value]) => {
      const { success } = flagsEnum.safeParse(qualifier);
      
      if ( !success ) {
        if ( process.env.NODE_ENV === 'development' ) {
          console.warn(`Invalid flag ${qualifier}, not applying.`)
        }
        return;
      }

      // The addFlag method encodes some characters, specifically
      // the "." character which breaks some use cases like
      // du_2.5
      cldAsset.addTransformation(`fl_${qualifier}:${value}`);
    });
  }

  return {};
}