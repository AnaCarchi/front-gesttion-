import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const TUTOR_ENTERPRISE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard(['TUTOR_ENTERPRISE'])],
    loadComponent: () =>
      import('./tutor-enterprise-layout/tutor-enterprise-layout.component')
        .then(m => m.TutorEnterpriseLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'my-students',
        loadComponent: () =>
          import('./my-students/my-students.component')
            .then(m => m.MyStudentsComponent)
      },
      {
        path: 'evaluations',
        loadComponent: () =>
          import('./evaluations/evaluations.component')
            .then(m => m.EvaluationsComponent)
      },
      {
        path: 'evaluate/:studentId',
        loadComponent: () =>
          import('./my-students/evaluation-form/evaluation-form.component')
            .then(m => m.EvaluationFormComponent)
      }
    ]
  }
];
