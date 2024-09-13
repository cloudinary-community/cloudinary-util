export interface CloudinaryVideoPlayerPlaylistOptions {
  /**
   * Whether to auto-advance to the next video and the delay between them.
   *
   * Possible values:
   * - 0: Advance Immediately.
   * - Any positive value: Delay in seconds between videos.
   * - false: Do not advance
   */
  autoAdvance?: number | false;

  /**
   * Whether to loop back to the first video after the last video in the playlist ends.
   */
  repeat?: boolean;

  /**
   * Whether to display a thumbnail link of the next video in the list when the current video
   * is almost finished.
   *
   * Possible values:
   * - false: Default. Do not present upcoming videos.
   * - true: Present upcoming videos 10 seconds before the end of the current video.
   * - Any positive value - Seconds before the end of the current video to show
   *   the upcoming video.
   */
  presentUpcoming?: number | boolean;
}

export interface CloudinaryVideoPlayerPlaylistByTagOptions
  extends CloudinaryVideoPlayerPlaylistOptions {
  /**
   * By default, the video list is sorted in the order returned by Cloudinary.
   * This parameter receives a function that sets the order of the retrieved video
   * sources. Your function should receive two entries and determine which one comes
   * first. This sorter behavior works similarly to Array.prototype.sort().
   */
  sorter?: (...args: any[]) => any;

  /**
   * Source settings that will apply to all retrieved videos.
   */
  sourceParams?: unknown;
}

export interface CloudinaryVideoPlayer {
  /**
   * Use the play method to play the current video.
   * @see https://cloudinary.com/documentation/video_player_api_reference#play
   */
  play: () => CloudinaryVideoPlayer;

  /**
   * Use the pause method to pause the current video.
   * @see https://cloudinary.com/documentation/video_player_api_reference#pause
   */
  pause: () => CloudinaryVideoPlayer;

  /**
   * Use the stop method to stop the current video (Same as Pause + set currentTime to 0).
   * @see https://cloudinary.com/documentation/video_player_api_reference#stop
   */
  stop: () => CloudinaryVideoPlayer;

  /**
   * Use the playNext method to play the next video in the playlist.
   * @see https://cloudinary.com/documentation/video_player_api_reference#playnext
   */
  playNext: () => CloudinaryVideoPlayer;

  /**
   * Use the playPrevious method to play the previous video in the playlist.
   * @see https://cloudinary.com/documentation/video_player_api_reference#playprevious
   */
  playPrevious: () => CloudinaryVideoPlayer;

  /**
   * Use the volume method to get or set the video player volume level.
   * The volume is a value between 0 (muted) and 1 (max volume).
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#playprevious
   */
  volume: (volume?: number) => number | CloudinaryVideoPlayer;

  /**
   * Use the mute method to mute the video player.
   * @see https://cloudinary.com/documentation/video_player_api_reference#mute
   */
  mute: () => CloudinaryVideoPlayer;

  /**
   * Use the unmute method to unmute the video player and revert the previous volume level.
   * @see https://cloudinary.com/documentation/video_player_api_reference#unmute
   */
  unmute: () => CloudinaryVideoPlayer;

  /**
   * Use the isMuted method to return whether the player is currently muted.
   * @see https://cloudinary.com/documentation/video_player_api_reference#ismuted
   */
  isMuted: () => boolean;

  /**
   * Use the currentTime method to get or set the current time of the video that is playing.
   * @see https://cloudinary.com/documentation/video_player_api_reference#currenttime
   */
  currentTime: (offsetSeconds?: number) => number | CloudinaryVideoPlayer;

  /**
   * Use the duration method to return the duration of the currently playing video.
   * @see https://cloudinary.com/documentation/video_player_api_reference#duration
   */
  duration: () => number;

  /**
   * Use the maximize method to enter fullscreen mode.
   * @see https://cloudinary.com/documentation/video_player_api_reference#maximize
   */
  maximize: () => CloudinaryVideoPlayer;

  /**
   * Use the exitMaximize method to exit fullscreen mode.
   * @see https://cloudinary.com/documentation/video_player_api_reference#exitmaximize
   */
  exitMaximize: () => CloudinaryVideoPlayer;

  /**
   * Use the isMaximized method to return whether video player is in full screen.
   * @see https://cloudinary.com/documentation/video_player_api_reference#ismaximized
   */
  isMaximized: () => boolean;

  /**
   * Use the posterOptions method to get or set the public ID and/or transformation to apply
   * from now on when a new video loads. By default, every new video that loads uses the
   * middle image of that video (/video/publicId.jpg).
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#posteroptions
   */
  posterOptions: (
    options?: CloudinaryVideoPlayerOptionPosterOptions,
  ) => CloudinaryVideoPlayerOptionPosterOptions | CloudinaryVideoPlayer;

  /**
   * Use the transformation method to get or set the base transformation of the player.
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#transformation
   */
  transformation: (transformation: unknown) => unknown[];

  /**
   * Use the sourceTransformation method to set the default transformation that will be used
   * for all videos of the specified source type.
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#sourcetransformation
   */
  sourceTransformation: (
    transformations?: Record<string, unknown>,
  ) => Record<string, unknown> | CloudinaryVideoPlayer;

  /**
   * Use the sourceTypes method to get or set the default source types (and optionally the
   * corresponding codecs) that will be used for every video. If a source type can't be
   * played in the requesting browser, the next source in the array will be tried. Add the
   * codec after the source type and separate with a '/', for example: mp4/h265.
   *
   * For HLS and MPEG-DASH, use the values hls and dash respectively and optionally specify
   * a codec as described above.
   *
   * For automatic format selection, use auto.
   *
   * For audio only, use audio.
   *
   * If you also define a codec as part of a transformation, this will override the
   * source type.
   *
   * Default: Default: f_auto:video. By default, automatic format selection is applied,
   * which selects the optimal file type based on the user's device and browser.
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#sourcetypes
   */
  sourceTypes: (sourceTypes: string[]) => string[];

  /**
   * Use the autoShowRecommendations boolean method to determine whether to show
   * recommendations at the end of the current video, if available. For playlists where
   * autoAdvance is false, the next videos are automatically used as the recommendations, if
   * none are explicitly defined. For players with a single source, in addition to setting
   * autoShowRecommendations to true, you must explicitly define the videos to recommend (or
   * provide a function or Promise that returns and array of sources) using the source
   * recommendations parameter. You can also optionally use the source.recommendations
   * parameter for sources in a playlist, which overrides the default behavior of showing
   * the next videos as recommendations.
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#autoshowrecommendations
   */
  autoShowRecommendations: (showRecommendations: boolean) => boolean;

  /**
   * Use the sourcesByTag method to retrieve the (promise of) the video sources for a
   * specified tag without actually creating the playlist. This method has the same syntax
   * and supports the same options as the playlistByTag.
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#sourcesbytag
   */
  sourcesByTag: (
    tag: string,
    options?: CloudinaryVideoPlayerPlaylistByTagOptions,
  ) => unknown;

  /**
   * Use the playlistByTag method to perform a call to the client-side asset list
   * operation and return a promise object that when fulfilled, returns the player
   * with a playlist comprised of all videos in your product environment with the
   * specified tag.
   *
   * @param tag String value representing the tag name with which to build the playlist from.
   * @param options Playlist options
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#playlistbytag
   */
  playlistByTag: (
    tag: string,
    options?: CloudinaryVideoPlayerPlaylistByTagOptions,
  ) => unknown;

  /**
   * Use the playlist method to get or set a list of video sources to play in the player,
   * including any required transformations.
   *
   * @param sources The video sources to play in the playlist, either a publicId or rawURL.
   * @param options Playlist options
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#playlist
   */
  playlist: (
    sources: string[],
    options?: CloudinaryVideoPlayerPlaylistOptions,
  ) => CloudinaryVideoPlayer;

  /**
   * Use the source method to set a new video source for the player and configure
   * it. Configure the new videoSource using the following as constructor parameters.
   * You can also get or set these as properties or operations on your videoSource object
   * after the initial instance loads.

   * @param source publicId or rawURL
   * @param options Source Options
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#source
   */
  source: (source: string, options?: unknown) => CloudinaryVideoPlayer;

  /**
   * Use the currentPublicId method to get the current source's Cloudinary public ID.
   * @see https://cloudinary.com/documentation/video_player_api_reference#currentpublicid
   */
  currentPublicId: () => string;

  /**
   * Use the on method to register an event handler to the specified event.
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#on
   * @see https://cloudinary.com/documentation/video_player_api_reference#events
   */
  on: (event: string, callback: (...args: any[]) => any) => void;

  /**
   * Use the off method to unregister an event handler from the specified event.
   *
   * @see https://cloudinary.com/documentation/video_player_api_reference#off
   * @see https://cloudinary.com/documentation/video_player_api_reference#events
   */
  off: (event: string, callback: (...args: any[]) => any) => void;

  /**
   * Use the dispose method to dispose the video player and remove its element from the DOM.
   * @see https://cloudinary.com/documentation/video_player_api_reference#dispose
   */
  dispose: () => void;

  /**
   * Use the el method to return the video player DOM element.
   * @see https://cloudinary.com/documentation/video_player_api_reference#el
   */
  el: () => HTMLVideoElement;

  /**
   * Use the width method to get or set the video player's width.
   * @see https://cloudinary.com/documentation/video_player_api_reference#width
   */
  width: (width?: number) => number;

  /**
   * Use the height method to get or set the video player's height.
   * @see https://cloudinary.com/documentation/video_player_api_reference#height
   */
  height: (height?: number) => number;

  /**
   * Use the fluid method to determine whether to responsively resize the video to fit the size of its container.
   * @see https://cloudinary.com/documentation/video_player_api_reference#fluid
   */
  fluid: (fluid?: boolean) => boolean;
}

export interface CloudinaryVideoPlayerOptionsLogo {
  logoImageUrl?: string;
  logoOnclickUrl?: string;
  showLogo?: boolean;
}

export interface CloudinaryVideoPlayerTextTracksTrackOptionsBox {
  height?: string | number;
  width?: string | number;
  x?: string | number;
  y?: string | number;
}

export type CloudinaryVideoPlayerTextTracksTrackOptionsGravity =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "center"
  | "top-right"
  | "bottom-right"
  | "bottom-left"
  | "top-left"
  | (string & {});

export type CloudinaryVideoPlayerTextTracksTrackOptionsTheme =
  | "default"
  | "videojs-default"
  | "yellow-outlined"
  | "player-colors"
  | "3d"
  | (string & {});

export interface CloudinaryVideoPlayerTextTracksTrackOptions {
  box?: CloudinaryVideoPlayerTextTracksTrackOptionsBox;
  fontFace?: string;
  fontSize?: string;
  gravity?: CloudinaryVideoPlayerTextTracksTrackOptionsGravity;
  style?: Record<string, string | number>;
  theme?: CloudinaryVideoPlayerTextTracksTrackOptionsTheme;
}

export interface CloudinaryVideoPlayerTextTracksTrack {
  default?: boolean;
  label?: string;
  language?: string;
  maxWords?: number;
  options?: CloudinaryVideoPlayerTextTracksTrackOptions;
  url?: string;
  wordHighlight?: boolean;
}

export interface CloudinaryVideoPlayerTextTracks {
  subtitles?: CloudinaryVideoPlayerTextTracksTrack;
  captions?: CloudinaryVideoPlayerTextTracksTrack;
}

export interface CloudinaryVideoPlayerOptions
  extends CloudinaryVideoPlayerOptionsLogo {
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;

  // ------------ Player visuals Props ------------
  aiHighlightsGraph?: boolean;
  bigPlayButton?: boolean | string;
  colors?: CloudinaryVideoPlayerOptionsColors;
  /**
   * @deprecated use top level options instead
   */
  controlBar?: {
    /**
     * @deprecated use {@link `pictureInPictureToggle`} instead
     */
    pictureInPictureToggle?: boolean;
  };
  controls?: boolean;
  floatingWhenNotVisible?: string;
  fluid?: boolean;
  fontFace?: string;
  hideContextMenu?: boolean;
  interactionAreas?: unknown;
  playbackRates?: Array<unknown>;
  playlistWidget?: {
    direction?: string;
    total?: string;
  };
  posterOptions?: CloudinaryVideoPlayerOptionPosterOptions;
  showJumpControls?: boolean;
  seekThumbnails?: boolean;
  videoJS?: object;

  // ------------ Player Behavior Props ------------
  autoPlay?: string | boolean | undefined; // Left behind for backward compactibility.
  autoplay?: string | boolean | undefined;
  autoplayMode?: string;
  autoShowRecommendations?: boolean;
  loop?: boolean;
  maxTries?: number;
  muted?: boolean;
  pictureInPictureToggle?: boolean;
  playedEventPercents?: number[];
  playedEventTimes?: null | Array<unknown>;
  playsinline?: boolean;
  videoTimeout?: number;
  withCredentials?: boolean;

  // ------------ Video Config Props ------------
  chapters?: object;
  chaptersButton?: boolean;
  preload?: string;
  publicId: string;
  sourceTransformation?: object;
  sourceTypes?: Array<string>;
  textTracks?: CloudinaryVideoPlayerTextTracks;
  transformation?: Array<object> | object;

  // ------------ Ads And Analytics Props ------------
  ads?: {
    adTagUrl?: string;
    adsInPlaylist?: string;
    showCountdown?: boolean;
    adLabel?: string;
    locale?: string;
    prerollTimeout?: number;
    postrollTimeout?: number;
  };
  analytics?: boolean;
  allowUsageReport?: boolean;

  // ------------ Delivery ------------
  cloud_name?: string;
  cname?: string;
  privateCdn?: boolean;
  queryParams?: Record<string, string | number | boolean> | string;
  secure?: boolean;
  secureDistribution?: string;

  // Misc

  language?: string;
  languages?: Record<string, object>;
}

export interface CloudinaryVideoPlayerOptionsColors {
  accent?: string;
  base?: string;
  text?: string;
}

export interface CloudinaryVideoPlayerOptionPosterOptions {
  /**
   * The public ID of the image to use as the poster.
   */
  publicId: string;

  /**
   * The transformation to apply on the specified video source. See transformation method
   * for syntax
   */
  transformation?: unknown;

  /**
   * A constant color to display instead of an image. Not relevant if also including the
   * publicId or transformation parameters in the posterOptions object. The color can be a
   * string value representing an RGB or RGBA hex triplet or quadruplet, a 3- or 4-digit RGB
   * RGBA hex, or a named color.
   */
  posterColor?: string;
}
