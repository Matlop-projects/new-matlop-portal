import * as CryptoJS from 'crypto-js';

/** Same rules as server `ClientPayloadCrypto` / C#: AES-256-CBC, PKCS7, key = password.PadRight(32,'0')[0..32] UTF-8. */
function apiKeyFromPassword(password: string): CryptoJS.lib.WordArray {
  const padded = (password + '0'.repeat(32)).slice(0, 32);
  return CryptoJS.enc.Utf8.parse(padded);
}

/**
 * Encrypts UTF-8 plain text; returns `ivBase64:cipherBase64` for the API middleware.
 */
export function encryptClientPayload(plainText: string, passwordApi: string): string {
  const key = apiKeyFromPassword(passwordApi);
  const iv = CryptoJS.lib.WordArray.random(16);
  const enc = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const ivB64 = CryptoJS.enc.Base64.stringify(iv);
  const cipherB64 = CryptoJS.enc.Base64.stringify(enc.ciphertext);
  return `${ivB64}:${cipherB64}`;
}
