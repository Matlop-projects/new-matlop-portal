export const environment = {
    production: false,
    baseUrl: 'https://backend.matlop.com/api/',
    baseImageUrl: 'https://backend.matlop.com',
    /** Google reCAPTCHA v2 site key (free): https://www.google.com/recaptcha/admin */
    recaptchaSiteKey: '6LdUGb4sAAAAAGTLNBPC2w9ABeZDH7ZpFxlrpjPQ',
    /** Must match API `ClientPayloadEncryption:Password` — AES body for POST /api/... (except AdminLogin). */
    clientPayloadEncryptionEnabled: true,
    clientPayloadApiPassword: '#as@$#$@as#',
  };
