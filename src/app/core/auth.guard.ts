import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToasterService } from '../services/toaster.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const toaster = inject(ToasterService);
// console.log(localStorage.getItem('token'));

  if (localStorage.getItem('token')) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    toaster.errorToaster('Session expired please login again');
    return false;
  }
};
