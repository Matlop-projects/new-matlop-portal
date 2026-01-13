import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(ToasterService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error?.error?.message ||
        error?.error?.title ||
        'shared.errors.general';

      switch (error.status) {
        case 401:
          toaster.errorToaster(message || 'Unauthorized');
          router.navigate(['/auth/login']);
          break;

        case 403:
          toaster.errorToaster(message || 'Forbidden');
          break;

        case 400:
          toaster.errorToaster(message || 'Bad request');
          break;

        case 0:
          toaster.errorToaster('shared.errors.network');
          break;

        default:
          toaster.errorToaster('shared.errors.server');
          break;
      }

      return throwError(() => error);
    })
  );
};
