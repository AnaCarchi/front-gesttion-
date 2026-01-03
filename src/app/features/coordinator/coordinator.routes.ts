import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const COORDINATOR_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard(['COORDINATOR'])],
    loadComponent: () =>
      import('./coordinator-layout/coordinator-layout.component')
        .then(m => m.CoordinatorLayoutComponent),
    children: [

      // REDIRECCIÓN BASE
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // DASHBOARD
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },

      // ESTUDIANTES
      {
        path: 'students',
        children: [

          // LISTADO POR ASIGNATURA
          {
            path: '',
            loadComponent: () =>
              import('./students/student-list/student-list.component')
                .then(m => m.StudentListComponent)
          },

          // CARGA MASIVA
          {
            path: 'bulk-upload',
            loadComponent: () =>
              import('./students/bulk-upload/bulk-upload.component')
                .then(m => m.BulkUploadComponent)
          },

          // ASIGNAR TUTORES A UNA ASIGNATURA
          {
            path: ':id/assign-tutor',
            loadComponent: () =>
              import('./students/assign-tutor/assign-tutor.component')
                .then(m => m.AssignTutorComponent)
          }
        ]
      },

      // TUTORES (ACADÉMICOS Y EMPRESARIALES)
      {
        path: 'tutors',
        loadComponent: () =>
          import('./tutor-list/tutor-list.component')
            .then(m => m.TutorListComponent)
      },

      // REPORTES
      {
        path: 'reports',
        loadComponent: () =>
          import('./reports/reports.component')
            .then(m => m.ReportsComponent)
      },
      {
        path: 'tutor-assignments',
        loadComponent: () =>
          import('./tutor-assignment/tutor-assignment.component')
        .then(m => m.TutorAssignmentComponent)
      }
    ]
  }
];
