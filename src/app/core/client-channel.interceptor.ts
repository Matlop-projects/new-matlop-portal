import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

/**
 * Tags API calls with X-Matlop-Client: Web so OtpSmsSendLog.ClientChannel is set.
 */
export const clientChannelInterceptor: HttpInterceptorFn = (req, next) => {
  const base = (environment.baseUrl || '').replace(/\/+$/, '');
  if (!base || !req.url.startsWith(base)) {
    return next(req);
  }
  if (req.headers.has('X-Matlop-Client')) {
    return next(req);
  }
  return next(
    req.clone({ setHeaders: { 'X-Matlop-Client': 'Web' } }),
  );
};
