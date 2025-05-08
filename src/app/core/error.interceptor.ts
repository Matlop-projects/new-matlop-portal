import {  inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToasterService } from '../services/toaster.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toaster = inject(ToasterService);
  const ngZone = inject(NgZone); // Inject NgZone


  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error.status);

      ngZone.run(() => {
        if (error.status === 401) {
          router.navigate(['/auth/login']);
          toaster.errorToaster(error.error.title || 'Unauthorized');
        } else if (error.status === 400) {
          toaster.errorToaster(error.error.message);
        } else if (error.status === 403) {
          toaster.errorToaster(error.error.message);
        }
      });

      return throwError(() => error);
    })
  );
};


