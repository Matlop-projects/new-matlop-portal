import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

// APIs that should NOT receive X-Country-Id header (to get unfiltered data)
const SKIP_COUNTRY_HEADER_URLS = [
  'Country/GetAll',
  'Country/getAll',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq = req;

  const token = localStorage.getItem('token');
  const countryId = localStorage.getItem('countryId') || '';
  const language = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';

  // Check if this request should skip the country header
  const shouldSkipCountryHeader = SKIP_COUNTRY_HEADER_URLS.some(url => req.url.includes(url));

  const commonHeaders: { [key: string]: string } = {
    'Accept-Language': language,
  };

  // Only add X-Country-Id if not in skip list
  if (!shouldSkipCountryHeader) {
    commonHeaders['X-Country-Id'] = countryId;
  }

  if (token && token.trim() !== '') {
    authReq = req.clone({
      setHeaders: {
        ...commonHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    authReq = req.clone({
      setHeaders: commonHeaders,
    });
  }

  return next(authReq);
};
