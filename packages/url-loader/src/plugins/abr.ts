import { z } from 'zod';

import { VideoOptions } from '../types/video';
import { PluginSettings } from '../types/plugins';

export const props = {
  streamingProfile: z.string()
    .describe(JSON.stringify({
      text: 'The streaming profile to apply when delivering a video using adaptive bitrate streaming.',
      url: 'https://cloudinary.com/documentation/transformation_reference#sp_streaming_profile'
    }))
    .optional(),
};

export const assetTypes = ['video', 'videos'];

export function plugin(props: PluginSettings<VideoOptions>) {
  const { cldAsset, options } = props;
  const { streamingProfile } = options;
  
  if ( typeof streamingProfile === 'string' ) {
    cldAsset.addTransformation(`sp_${streamingProfile}`);
  }

  return {};
}