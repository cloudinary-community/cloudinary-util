import { z } from 'zod';

import { assetOptionsSchema } from './asset';

export const videoOptionsResizeSchema = assetOptionsSchema;

export type VideoOptionsResize = z.infer<typeof videoOptionsResizeSchema>;

export const videoOptionsSchema = assetOptionsSchema.extend({
  streamingProfile: z.string()
    .describe(JSON.stringify({
      text: 'The streaming profile to apply when delivering a video using adaptive bitrate streaming.',
      url: 'https://cloudinary.com/documentation/transformation_reference#sp_streaming_profile'
    }))
    .optional(),
})

export type VideoOptions = z.infer<typeof videoOptionsSchema>;