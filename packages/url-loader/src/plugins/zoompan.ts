import { PluginSettings, PluginOverrides } from '../types/plugins';

export const props = ['zoompan'];

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;
  const { zoompan = false } = options;

  const overrides: PluginOverrides = {
    format: undefined
  };

  if ( zoompan === true ) {
    cldAsset.effect('e_zoompan');
  } else if ( typeof zoompan === 'string' ) {
    if ( zoompan === 'loop' ) {
      cldAsset.effect('e_zoompan');
      cldAsset.effect('e_loop');
    } else {
      cldAsset.effect(`e_zoompan:${zoompan}`);
    }
  } else if ( typeof zoompan === 'object' ) {
    let zoompanEffect = 'e_zoompan';

    if ( typeof zoompan.options === 'string' ) {
      zoompanEffect = `${zoompanEffect}${zoompan.options}`;
    }

    cldAsset.effect(zoompanEffect);

    let loopEffect;

    if ( zoompan.loop === true ) {
      loopEffect = 'e_loop';
    } else if ( typeof zoompan.loop === 'string' ) {
      loopEffect = `e_loop${zoompan.loop}`;
    }

    if ( loopEffect ) {
      cldAsset.effect(loopEffect);
    }
  }

  if ( zoompan !== false ) {
    overrides.format = 'gif';
  }

  return {
    options: overrides
  }
}