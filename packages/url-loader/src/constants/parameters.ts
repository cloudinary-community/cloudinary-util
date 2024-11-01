import type { StringifiablePrimative } from "../lib/utils.js";

/**
 *  @description Mode to use when cropping an asset.
 *  @url https://cloudinary.com/documentation/transformation_reference#c_crop_resize
 */
export type CropMode =
  | "auto"
  | "crop"
  | "fill"
  | "fill_pad"
  | "fit"
  | "imagga_crop"
  | "imagga_scale"
  | "lfill"
  | "limit"
  | "lpad"
  | "mfit"
  | "mpad"
  | "pad"
  | "scale"
  | "thumb";

/**
 *  @description Whether to keep the content of the extracted area, or to replace it with a mask.
 *  @url https://cloudinary.com/documentation/transformation_reference#e_extract
 */
export type ExtractMode = "content" | "mask";

/**
 *  @description Rotates or flips an asset by the specified number of degrees or automatically according to its orientation or available metadata.
 *  @url https://cloudinary.com/documentation/transformation_reference#a_angle
 */
export type Angle = string | number;

/** Aspect Ratio */

export type AspectRatioMode =
  | "vflip"
  | "hflip"
  | "ignore"
  | "auto_right"
  | "auto_left";

/**
 *  @description Crops or resizes the asset to a new aspect ratio.
 *  @url https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
 */
export type AspectRatio = AspectRatioMode | number | (string & {});

export type Flag =
  | "animated"
  | "any_format"
  | "apng"
  | "attachment"
  | "awebp"
  | "clip"
  | "clip_evenodd"
  | "cutter"
  | "force_icc"
  | "force_strip"
  | "getinfo"
  | "group4"
  | "hlsv3"
  | "ignore_aspect_ratio"
  | "ignore_mask_channels"
  | "immutable_cache"
  | "keep_attribution"
  | "keep_dar"
  | "keep_iptc"
  | "layer_apply"
  | "lossy"
  | "mono"
  | "no_overflow"
  | "no_stream"
  | "png8_fl_png24_fl_png32"
  | "preserve_transparency"
  | "progressive"
  | "rasterize"
  | "region_relative"
  | "relative"
  | "replace_image"
  | "sanitize"
  | "splice"
  | "streaming_attachment"
  | "strip_profile"
  | "text_disallow_overflow"
  | "text_no_trim"
  | "tiff8_lzw"
  | "tiled"
  | "truncate_ts"
  | "waveform";

/**
 *  @description Alters the regular behavior of another transformation or the overall delivery behavior.
 *  @url https://cloudinary.com/documentation/transformation_reference#fl_flag
 *  @qualifier fl
 */
export type FlagsDefinition = ListableFlags | FlagRecord;

export type ListableFlags = Flag | ReadonlyArray<Flag>;

export type FlagRecord = Partial<Record<Flag, StringifiablePrimative>>;

/**
 * @description Converts (if necessary) and delivers an asset in the specified format regardless of the file extension used in the delivery URL.
 * @url https://cloudinary.com/documentation/transformation_reference#f_format
 * @qualifier f
 */
export type Format =
  | "auto"
  | "auto:image"
  | "auto:animated"
  | "gif"
  | "png"
  | "jpg"
  | "bmp"
  | "ico"
  | "pdf"
  | "tiff"
  | "eps"
  | "jpc"
  | "jp2"
  | "psd"
  | "webp"
  | "zip"
  | "svg"
  | "webm"
  | "wdp"
  | "hpx"
  | "djvu"
  | "ai"
  | "flif"
  | "bpg"
  | "miff"
  | "tga"
  | "heic"
  | "default" // library specific feature to turn off automatic optimization
  | (string & {});

/**
 *  @description Determines which part of an asset to focus on. Note: Default of auto is applied for supported crop modes only.
 *  @url https://cloudinary.com/documentation/transformation_reference#g_gravity
 */
export type Gravity =
  | "auto"
  | "auto_content_aware"
  | "center"
  | "custom"
  | "east"
  | "face"
  | "face_center"
  | "multi_face"
  | "north"
  | "north_east"
  | "north_west"
  | "south"
  | "south_east"
  | "south_west"
  | "west"
  | "xy_center"
  | "face:center"
  | "face:auto"
  | "faces"
  | "faces:center"
  | "faces:auto"
  | "body"
  | "body:face"
  | "adv_face"
  | "adv_faces"
  | "adv_eyes"
  | "custom:face"
  | "custom:faces"
  | "custom:adv_face"
  | "custom:adv_faces"
  | "auto:adv_face"
  | "auto:adv_faces"
  | "auto:adv_eyes"
  | "auto:body"
  | "auto:face"
  | "auto:faces"
  | "auto:custom_no_override"
  | "auto:none"
  | "liquid"
  | "ocr_text"
  | (string & {});

/**
 *  @description A qualifier that determines the height of a transformed asset or an overlay.
 *  @url https://cloudinary.com/documentation/transformation_reference#h_height
 */
export type Height = number | string;

/**
 *  @description Should generative AI features detect multiple instances.
 */
export type Multiple = boolean;

/**
 *  @description Natural language descriptions used for generative AI capabilities.
 */
export type ListablePrompts = string | ReadonlyArray<string>;

/**
 *  @description A qualifier that sets the desired width of an asset using a specified value, or automatically based on the available width.
 *  @url https://cloudinary.com/documentation/transformation_reference#w_width
 */
export type Width = number | string;

/**
 *  @description Adjusts the starting location or offset of the x axis.
 *  @url https://cloudinary.com/documentation/transformation_reference#x_y_coordinates
 */
export type X = number | string;

/**
 *  @description Adjusts the starting location or offset of the y axis.
 *  @url https://cloudinary.com/documentation/transformation_reference#x_y_coordinates
 */
export type Y = number | string;

/** Zoom */

/**
 * @description Controls how close to crop to the detected coordinates when using face-detection, custom-coordinate, or object-specific gravity.
 * @url https://cloudinary.com/documentation/transformation_reference#z_zoom
 */
export type Zoom = number | string;

// this was originally called PositionOptions but it conflicts with a
// DOM type, leading to confusing results if e.g. the import is deleted,
// the type falls back to the global
export interface PositionalOptions {
  angle?: Angle;
  gravity?: Gravity;
  x?: X;
  y?: Y;
}
