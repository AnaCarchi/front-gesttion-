import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tutor-enterprise-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <header class="header">
      <h2>Tutor Empresarial</h2>
      <button (click)="logout()">Cerrar sesión</button>
    </header>

    <nav class="nav">
      <a routerLink="/tutor-enterprise/dashboard" routerLinkActive="active">
        Dashboard
      </a>
      <a routerLink="/tutor-enterprise/my-students" routerLinkActive="active">
        Mis Estudiantes
      </a>
      <a routerLink="/tutor-enterprise/evaluations" routerLinkActive="active">
        Evaluaciones
      </a>
    </nav>

    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      background: #111827;
      color: white;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button {
      background: #ef4444;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
    }
    .nav {
      background: #f3f4f6;
      padding: 12px 24px;
      display: flex;
      gap: 16px;
    }
    .nav a {
      text-decoration: none;
      color: #1f2937;
      font-weight: 500;
    }
    .nav a.active {
      font-weight: bold;
      color: #2563eb;
    }
    .content {
      padding: 24px;
    }
  `]
})
export class TutorEnterpriseLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
