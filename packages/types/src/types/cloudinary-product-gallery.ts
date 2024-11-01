export interface CloudinaryProductGallery {
  // Required parameters
  cloudName?: string;
  mediaAssets?:
    | {
        publicId?: string;
        tag?: string;
        mediaType?: string;
        resourceType?: string;
        transformation?: object;
        thumbnailTransformation?: object;
        altText?: string;
        videoPlayerSource?: object;
      }[]
    | string[]; // string[] is a list of publicIDs
  container?: string | HTMLElement;

  // Widget
  analytics?: boolean;
  displayProps?: {
    mode?: "classic" | "expanded";
    spacing?: number;
    columns?: number;
    topOffset?: number;
    bottomOffset?: number;
  };
  focus?: boolean;
  loaderProps?: {
    color?: string;
    opacity?: number;
    style?: "cloudinary" | "circle" | "custom";
    url?: string;
  };
  placeholderImage?: boolean;
  sort?: "none" | "asc" | "desc";
  sortProps?: {
    source?: string;
    id?: string;
    direction?: string;
  };
  themeProps?: {
    primary?: string; // Default: "#FFFFFF"
    onPrimary?: string; // Default: "#000000"
    active?: string; // Default: "#0078FF"
  };
  viewportBreakpoints?: {
    breakpoint: number; // Required
    [key: string]: any; // Other configuration parameters to override
  }[];

  // Main viewer parameters
  accessibilityProps?: {
    mediaAltSource?: string;
    mediaAltId?: string;
  };
  ar3dProps?: {
    shadows?: boolean;
    showAR?: boolean;
  };
  aspectRatio?:
    | "square"
    | "1:1"
    | "3:4"
    | "4:3"
    | "4:6"
    | "6:4"
    | "5:7"
    | "7:5"
    | "5:8"
    | "8:5"
    | "9:16"
    | "16:9";
  borderColor?: string;
  borderWidth?: number;
  imageBreakpoint?: number;
  videoBreakpoint?: number;
  preload?: string[];
  radius?: number;
  spinProps?: {
    animate?: "none" | "start" | "end" | "both";
    spinDirection?: "clockwise" | "counter-clockwise";
    disableZoom?: boolean;
    showTip?: "always" | "never" | "touch";
    tipPosition?: "top" | "center" | "bottom";
    tipText?: string; // Default: "Drag to rotate"
    tipTouchText?: string; // Default: "Swipe to rotate"
  };
  startIndex?: number;
  tipProps?: {
    textColor?: string;
    color?: string;
    radius?: number;
    opacity?: number;
  };
  transition?: "slide" | "fade" | "none";
  videoProps?: {
    controls?: string;
    sound?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    playerType?: string;
  };
  zoom?: boolean;
  zoomProps?: any;
  zoomPopupProps?: {
    backdropColor?: string;
    backdropOpacity?: number;
    zIndex?: number;
  };

  // Carousel parameters
  carouselLocation?: "left" | "right" | "top" | "bottom";
  carouselOffset?: number;
  carouselStyle?: "none" | "thumbnails" | "indicators";
  indicatorProps?: {
    color?: string;
    selectedColor?: string;
    shape?: "round" | "square" | "radius";
    size?: number;
    spacing?: number;
    sticky?: boolean;
  };
  thumbnailProps?: any;

  // Navigation parameters
  navigation?: "none" | "always" | "mouseover";
  navigationButtonProps?: {
    shape?: "none" | "round" | "square" | "radius" | "rectangle";
    iconColor?: string;
    color?: string;
    size?: number;
  };
  navigationOffset?: number;
  navigationPosition?: "inside" | "outside" | "offset";
}
