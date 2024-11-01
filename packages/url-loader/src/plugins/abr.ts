import { plugin } from "../lib/plugin.js";

export declare namespace AbrPlugin {
  export interface Options {
    /**
     * @description The streaming profile to apply when delivering a video using adaptive bitrate streaming.
     * @url https://cloudinary.com/documentation/transformation_reference#sp_streaming_profile
     */
    streamingProfile?: string;
  }
}

export const AbrPlugin = /* #__PURE__ */ plugin({
  name: "Abr",
  supports: "video",
  inferOwnOptions: {} as AbrPlugin.Options,
  props: {
    streamingProfile: true,
  },
  apply: (asset, opts) => {
    if (typeof opts.streamingProfile !== "string") return {};

    asset.addTransformation(`sp_${opts.streamingProfile}`);

    return {};
  },
});
