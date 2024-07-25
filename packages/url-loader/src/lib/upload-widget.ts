import { CloudinaryUploadWidgetError, CloudinaryUploadWidgetOptions, CloudinaryUploadWidgetResults } from '@cloudinary-util/types';

import { ConfigOptions } from '../types/config';

/**
 * getUploadWidgetOptions
 */

export interface GetUploadWidgetOptions extends CloudinaryUploadWidgetOptions {
  uploadSignature?: CloudinaryUploadWidgetOptions["uploadSignature"];
}

export function getUploadWidgetOptions({ uploadSignature, ...options } : GetUploadWidgetOptions, config: ConfigOptions) {
  const signed = typeof uploadSignature === 'function';

  // When creating a signed upload, you need to provide both your Cloudinary API Key
  // as well as a signature generator function that will sign any paramters
  // either on page load or during the upload process. Read more about signed uploads at:
  // https://cloudinary.com/documentation/upload_widget#signed_uploads

  const { cloudName, apiKey } = config?.cloud || {};

  if (!cloudName) {
    throw new Error('A Cloudinary Cloud name is required, please make sure your environment variable is set and configured in your environment.');
  }

  if (signed && !apiKey) {
    throw new Error('A Cloudinary API Key is required for signed requests, please make sure your environment variable is set and configured in your environment.');
  }
  
  if ( !signed && !options.uploadPreset ) {
    throw new Error('A Cloudinary Upload Preset is required for unsigned uploads. Please specify an uploadPreset or configure signed uploads.');
  }

  const uploadOptions: CloudinaryUploadWidgetOptions = {
    cloudName,
    apiKey,
    ...options,
  };

  if ( signed ) {
    uploadOptions.uploadSignature = uploadSignature;
  }

  return uploadOptions;
}


/**
 * generateUploadWidgetResultCallback
 */

export type CloudinaryUploadWidgetResultCallback = (results: CloudinaryUploadWidgetResults) => void;
export type CloudinaryUploadWidgetErrorCallback = (error: CloudinaryUploadWidgetError, results: CloudinaryUploadWidgetResults) => void;

export interface GenerateUploadWidgetResultCallback {
  onOpen?: CloudinaryUploadWidgetResultCallback;
  /**
   * @deprecated use onSuccess instead
   */
  onUpload?: CloudinaryUploadWidgetResultCallback;
  onAbort?: CloudinaryUploadWidgetResultCallback;
  onBatchCancelled?: CloudinaryUploadWidgetResultCallback;
  onClose?: CloudinaryUploadWidgetResultCallback;
  onDisplayChanged?: CloudinaryUploadWidgetResultCallback;
  onPublicId?: CloudinaryUploadWidgetResultCallback;
  onQueuesEnd?: CloudinaryUploadWidgetResultCallback;
  onQueuesStart?: CloudinaryUploadWidgetResultCallback;
  onRetry?: CloudinaryUploadWidgetResultCallback;
  onShowCompleted?: CloudinaryUploadWidgetResultCallback;
  onSourceChanged?: CloudinaryUploadWidgetResultCallback;
  onSuccess?: CloudinaryUploadWidgetResultCallback;
  onTags?: CloudinaryUploadWidgetResultCallback;
  onUploadAdded?: CloudinaryUploadWidgetResultCallback;
  onError: CloudinaryUploadWidgetErrorCallback;
  onResult: CloudinaryUploadWidgetResultCallback;
}

const UPLOAD_WIDGET_EVENTS: { [key: string]: string } = {
  'abort': 'onAbort',
  'batch-cancelled': 'onBatchCancelled',
  'close': 'onClose',
  'display-changed': 'onDisplayChanged',
  'publicid': 'onPublicId',
  'queues-end': 'onQueuesEnd',
  'queues-start': 'onQueuesStart',
  'retry': 'onRetry',
  'show-completed': 'onShowCompleted',
  'source-changed': 'onSourceChanged',
  'success': 'onSuccess',
  'tags': 'onTags',
  'upload-added': 'onUploadAdded',
}

export function generateUploadWidgetResultCallback(options: GenerateUploadWidgetResultCallback) {
  return function resultCallback(error: CloudinaryUploadWidgetError, uploadResult: CloudinaryUploadWidgetResults) {
    if ( error && error !== null ) {
      if ( typeof options.onError === 'function' ) {
        options.onError(error, uploadResult);
      }
    }

    if ( typeof options.onResult === 'function' ) {
      options.onResult(uploadResult);
    }

    const widgetEvent = typeof uploadResult?.event === 'string' && UPLOAD_WIDGET_EVENTS[uploadResult.event] as keyof typeof options;

    if ( typeof widgetEvent === 'string' && typeof options[widgetEvent] === 'function' ) {
      const callback = options[widgetEvent] as CloudinaryUploadWidgetResultCallback;
      callback(uploadResult);
    }
  }
}