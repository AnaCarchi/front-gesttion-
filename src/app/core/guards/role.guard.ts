import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RoleName } from '../models/role.model';

export const roleGuard = (allowedRoles: RoleName[]): CanActivateFn => {
  return () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.getCurrentUser();

    // ❌ Sin sesión o sin roles
    if (!user || !user.roles || user.roles.length === 0) {
      router.navigate(['/auth/login']);
      return false;
    }

    // ✅ Validar por nombre del rol
    const hasRole = user.roles.some(role =>
      allowedRoles.includes(role.name)
    );

    if (hasRole) {
      return true;
    }

    // ❌ No autorizado
    router.navigate(['/unauthorized']);
    return false;
  };
};
