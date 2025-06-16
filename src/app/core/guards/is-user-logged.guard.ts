import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const isUserLoggedGuard: CanActivateFn = () => {
  const service = inject(UserService);
  const router = inject(Router);
  if (service.isUserLogged()) return true;
  else {
    return router.createUrlTree(['/login']);
  }
};
