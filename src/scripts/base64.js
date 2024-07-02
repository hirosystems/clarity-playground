/**
 * @param {string} base64
 */
function toUrlSafeBase64(base64) {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * @param {string} urlSafeBase64
 * @returns
 */
function fromUrlSafeBase64(urlSafeBase64) {
  return urlSafeBase64.replace(/-/g, "+").replace(/_/g, "/");
}

/**
 * @param {string} code
 */
export function compressAndEncode(code) {
  const base64 = btoa(code);
  return toUrlSafeBase64(base64);
}

/**
 * @param {string} encoded
 */
export function decodeAndDecompress(encoded) {
  const base64 = fromUrlSafeBase64(encoded);
  return atob(base64);
}
