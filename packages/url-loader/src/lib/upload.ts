/**
 * generateSignature
 * @description Makes a request to an endpoint to sign Cloudinary parameters as part of widget creation
 */

export interface GenerateSignatureCallback {
  fetch: Function;
  signatureEndpoint: string;
}

export function generateSignatureCallback({
  signatureEndpoint,
  fetch: fetcher,
}: GenerateSignatureCallback) {
  return function generateSignature(
    callback: (signature: string | null, error?: unknown) => void,
    paramsToSign: object,
  ) {
    if (typeof signatureEndpoint === "undefined") {
      throw Error(
        "Failed to generate signature: signatureEndpoint property undefined.",
      );
    }

    if (typeof fetcher === "undefined") {
      throw Error("Failed to generate signature: fetch property undefined.");
    }

    fetcher(signatureEndpoint, {
      method: "POST",
      body: JSON.stringify({
        paramsToSign,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response: { json: Function }) => response.json())
      .then((result: { signature: string }) => {
        callback(result.signature);
      })
      .catch((error: unknown) => {
        callback(null, error);
      });
  };
}
