import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'coordinator',
    canActivate: [authGuard, roleGuard(['COORDINATOR'])],
    loadChildren: () =>
      import('./features/coordinator/coordinator.routes')
        .then(m => m.COORDINATOR_ROUTES)
  },
  {
    path: 'tutor',
    canActivate: [authGuard, roleGuard(['TUTOR_ACADEMIC'])],
    loadChildren: () =>
      import('./features/tutor/tutor.routes')
        .then(m => m.TUTOR_ROUTES)
  },
  {
    path: 'tutor-enterprise',
    canActivate: [authGuard, roleGuard(['TUTOR_ENTERPRISE'])],
    loadChildren: () =>
      import('./features/tutor-enterprise/tutor-enterprise.routes')
        .then(m => m.TUTOR_ENTERPRISE_ROUTES)
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard(['STUDENT'])],
    loadChildren: () =>
      import('./features/student/student.routes')
        .then(m => m.STUDENT_ROUTES)
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/components/unauthorized/unauthorized.component')
        .then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];
