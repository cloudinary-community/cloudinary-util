interface AssetType {
  seo?: boolean;
}

export const assetTypes: Record<string, AssetType> = {
  image: {},
  images: {
    seo: true
  },
  video: {},
  videos: {
    seo: true
  },
  raw: {},
  files: {
    seo: true
  },
} as const;