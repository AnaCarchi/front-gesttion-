import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard(['STUDENT'])],
    loadComponent: () =>
      import('./student-layout/student-layout.component')
        .then(m => m.StudentLayoutComponent),
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

      // DOCUMENTOS GENERALES
      {
        path: 'documents',
        loadComponent: () =>
          import('./documents/documents.component')
            .then(m => m.DocumentsComponent)
      },

      // MIS ASIGNATURAS
      {
        path: 'my-subjects',
        children: [

          // VINCULACIÓN
          {
            path: 'vinculation',
            loadComponent: () =>
              import('./my-subjects/vinculation/vinculation.component')
                .then(m => m.VinculationComponent)
          },

          // PRÁCTICAS FORMACIÓN DUAL
          {
            path: 'internship-dual',
            loadComponent: () =>
              import('./my-subjects/internship-dual/internship-dual.component')
                .then(m => m.InternshipDualComponent)
          },

          // PRÁCTICAS PREPROFESIONALES
          {
            path: 'internship-preprofessional',
            loadComponent: () =>
              import('./my-subjects/internship-preprofessional/internship-preprofessional.component')
                .then(m => m.InternshipPreprofessionalComponent)
          }
        ]
      }
    ]
  }
];
