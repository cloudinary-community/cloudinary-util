import { describe, it, expect } from 'vitest';

import { generateSignatureCallback } from '../../src/lib/upload';

describe('upload', () => {
  describe('generateSignatureCallback', () => {
    it('should generate a signature callback function', async () => {
      let results = undefined;

      const paramsToSign = {
        uploadPreset: 'mypreset',
        timestamp: Date.now()
      }

      // this isn't really the signature's signature, just an easy way to test as a string

      const signature = JSON.stringify(paramsToSign);

      async function fetcher() {
        return {
          json: async () => {
            return {
              signature
            }
          }
        }
      }

      const signatureCallback = generateSignatureCallback({
        signatureEndpoint: '/asdf',
        fetch: fetcher
      })

      function callback(signature) {
        results = signature;
      }

      const options = {
        callback
      }

      signatureCallback(options.callback, paramsToSign)

      await expect.poll(() => results).toBe(signature);
    });
  });
});