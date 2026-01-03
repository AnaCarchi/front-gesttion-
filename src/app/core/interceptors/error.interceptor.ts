import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      let message = 'Ha ocurrido un error inesperado';

      // 🔐 Sesión inválida (simulada)
      if (error.status === 401) {
        message = 'Sesión expirada. Inicie sesión nuevamente.';
        authService.logout();
        router.navigate(['/auth/login']);
      }

      // 🚫 Acceso no autorizado
      if (error.status === 403) {
        message = 'No tiene permisos para acceder a esta sección.';
        router.navigate(['/unauthorized']);
      }

      console.error('[Interceptor Error]', message, error);
      return throwError(() => new Error(message));
    })
  );
};
