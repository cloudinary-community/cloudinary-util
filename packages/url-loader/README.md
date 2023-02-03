# Cloudinary URL Loader

A function to construct a Cloudinary URL based on a set of options.

The loader works by loading a list of "plugins" which provide option-based configuration for features like optimization, cropping, and background removal.

## 🚀 Getting Started

* Install Cloudinary URL Loader:

```
npm install @cloudinary-util/url-loader
```

* Import the dependency:

import { constructCloudinaryUrl } from '@cloudinary-util/url-loader';

* Create a Cloudinary URL:

```
const url = constructCloudinaryUrl({
  options: {
    src: 'my-public-id',
    width: 800,
    height: 600
  },
  config: {
    cloud: {
      cloudName: 'my-cloud'
    }
  }
});
```
