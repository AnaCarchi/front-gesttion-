import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-tutor-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <header class="header">
      <h2>{{ title }}</h2>
      <button (click)="logout()">Cerrar sesión</button>
    </header>

    <nav class="nav">
      <a routerLink="/tutor/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/tutor/my-students" routerLinkActive="active">Mis Estudiantes</a>
      <a routerLink="/tutor/evaluations" routerLinkActive="active">Evaluaciones</a>
    </nav>

    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header {
      background: #1f2937;
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
export class TutorLayoutComponent implements OnInit {

  private auth = inject(AuthService);
  private router = inject(Router);

  title = 'Tutor';

  ngOnInit(): void {
    const user = this.auth.getCurrentUser() as User | null;

    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (user.roles?.some(r => r.name === 'TUTOR_ACADEMIC')) {
      this.title = 'Tutor Académico';
    }

    if (user.roles?.some(r => r.name === 'TUTOR_ENTERPRISE')) {
      this.title = 'Tutor Empresarial';
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
