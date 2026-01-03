import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    const hasRole = user.roles.some(r =>
      allowedRoles.includes(r.name)
    );

    if (!hasRole) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};
