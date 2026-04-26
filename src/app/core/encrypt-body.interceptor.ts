import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { encryptClientPayload } from './client-payload-crypto';

/** Match API `UnencryptedExceptionPathPrefixes` (case-insensitive). */
const UNENCRYPTED_PATH_MARKERS = ['authentication/adminlogin'];

function shouldEncryptRequest(url: string, method: string): boolean {
  if (!environment.clientPayloadEncryptionEnabled || !environment.clientPayloadApiPassword) {
    return false;
  }
  if (method !== 'POST') {
    return false;
  }
  const b = (environment.baseUrl || '').replace(/\/+$/, '');
  if (!b) {
    return false;
  }
  if (!url.startsWith(b)) {
    return false;
  }
  const rest = url.slice(b.length).toLowerCase();
  return !UNENCRYPTED_PATH_MARKERS.some((m) => rest.includes(m));
}

/**
 * Wraps JSON POST bodies in AES-256-CBC (same as mobile), `ivB64:cipherB64` + `text/plain`
 * for `ClientEncryptedRequestBodyMiddleware` on the API.
 */
export const encryptPostBodyInterceptor: HttpInterceptorFn = (req, next) => {
  if (!shouldEncryptRequest(req.url, req.method)) {
    return next(req);
  }
  if (req.body == null) {
    return next(req);
  }
  if (req.body instanceof FormData || req.body instanceof Blob) {
    return next(req);
  }

  const plain = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  if (plain == null) {
    return next(req);
  }

  try {
    const wire = encryptClientPayload(plain, environment.clientPayloadApiPassword!);
    return next(
      req.clone({
        body: wire,
        setHeaders: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    );
  } catch (e) {
    console.error('Client payload encryption failed', e);
    return next(req);
  }
};
