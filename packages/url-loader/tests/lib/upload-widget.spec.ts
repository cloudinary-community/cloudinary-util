import { describe, expect, it, vi } from "vitest";

import {
  generateUploadWidgetResultCallback,
  getUploadWidgetOptions,
} from "../../src/lib/upload-widget.js";
import { generateSignatureCallback } from "../../src/lib/upload.js";

describe("upload-widget", () => {
  describe("getUploadWidgetOptions", () => {
    it("should return create an options object for unsigned requests", () => {
      const options = {
        uploadPreset: "mypreset",
      };

      const config = {
        cloud: {
          cloudName: "testcloud",
          apiKey: "abcd1234",
        },
      };

      const expectedOptions = {
        cloudName: config.cloud.cloudName,
        apiKey: config.cloud.apiKey,
        uploadPreset: options.uploadPreset,
      };

      expect(getUploadWidgetOptions(options, config)).toMatchObject(
        expectedOptions,
      );
    });

    it("should return create an options object with minimal config for signed requests", () => {
      const options = {
        uploadSignature: generateSignatureCallback({
          signatureEndpoint: "/asdf",
          fetch,
        }),
      };

      const config = {
        cloud: {
          cloudName: "testcloud",
          apiKey: "abcd1234",
        },
      };

      const expectedOptions = {
        cloudName: config.cloud.cloudName,
        apiKey: config.cloud.apiKey,
        uploadSignature: options.uploadSignature,
      };

      expect(getUploadWidgetOptions(options, config)).toMatchObject(
        expectedOptions,
      );
    });
  });

  describe("getUploadWidgetOptions", () => {
    it("should generate a callback function and invoke an error", () => {
      function onError() {}

      function onResult() {}

      function onSuccess() {}

      const options = {
        onError,
        onResult,
        onSuccess,
      };

      const spyError = vi.spyOn(options, "onError");
      const spyResult = vi.spyOn(options, "onResult");
      const spySuccess = vi.spyOn(options, "onSuccess");

      const resultCallback = generateUploadWidgetResultCallback(options);

      const error = "Error";
      const result = {};

      resultCallback(error, result);

      expect(spyError).toHaveBeenCalledWith(error, result);
      expect(spyResult).toHaveBeenCalledWith(result);
      expect(spySuccess).not.toHaveBeenCalled();
    });

    it("should generate a callback function and invoke results on success", () => {
      function onError() {}

      function onResult() {}

      function onSuccess() {}

      const options = {
        onError,
        onResult,
        onSuccess,
      };

      const spyError = vi.spyOn(options, "onError");
      const spyResult = vi.spyOn(options, "onResult");
      const spySuccess = vi.spyOn(options, "onSuccess");

      const resultCallback = generateUploadWidgetResultCallback(options);

      const result = {
        event: "success",
      };

      resultCallback(null, result);

      expect(spyError).not.toHaveBeenCalled();
      expect(spyResult).toHaveBeenCalledWith(result);
      expect(spySuccess).toHaveBeenCalledWith(result);
    });
  });
});
