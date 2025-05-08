import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize, catchError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  // Check if the URL contains 'Notification/GetNotifications'
  if (!req.url.includes('Notification/GetNotifications')) {
    // Show the spinner only if the URL does not contain 'Notification/GetNotifications'
    spinner.show();
  }

  return next(req).pipe(
    catchError((error) => {
      // Hide the spinner in case of an error
      spinner.hide();
      throw error; // Re-throw the error
    }),
    finalize(() => {
      // Hide the spinner once the request is completed (success or error)
      if (!req.url.includes('Notification/GetNotifications')) {
        spinner.hide();
      }
    })
  );
};
