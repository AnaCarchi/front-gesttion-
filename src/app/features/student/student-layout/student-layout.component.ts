import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink
  ],
  template: `
    <div class="student-layout">

      <!-- HEADER -->
      <header class="header">
        <h2>Sistema de Gestión Yavirac</h2>
        <button class="logout-btn" (click)="logout()">Cerrar sesión</button>
      </header>

      <!-- NAV -->
      <nav class="nav">
        <a routerLink="/student/dashboard" routerLinkActive="active">
          Dashboard
        </a>

        <a routerLink="/student/my-subjects/vinculation" routerLinkActive="active">
          Vinculación
        </a>

        <a routerLink="/student/my-subjects/internship-dual" routerLinkActive="active">
          Prácticas Dual
        </a>

        <a routerLink="/student/my-subjects/internship-preprofessional" routerLinkActive="active">
          Prácticas Preprofesionales
        </a>

        <a routerLink="/student/documents" routerLinkActive="active">
          Documentos
        </a>
      </nav>

      <!-- CONTENT -->
      <main class="content">
        <router-outlet></router-outlet>
      </main>

    </div>
  `,
  styles: [`
    .student-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: #1f2937;
      color: white;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logout-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
    }

    .nav {
      display: flex;
      gap: 16px;
      padding: 12px 24px;
      background: #f3f4f6;
    }

    .nav a {
      text-decoration: none;
      color: #1f2937;
      font-weight: 600;
    }

    .nav a.active {
      color: #2563eb;
    }

    .content {
      flex: 1;
      padding: 24px;
      background: #f9fafb;
    }
  `]
})
export class StudentLayoutComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
