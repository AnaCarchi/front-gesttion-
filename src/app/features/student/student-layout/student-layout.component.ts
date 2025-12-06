import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="student-layout">
      <div class="header-banner">
        <div class="banner-content">
          <div class="student-icon">🎓</div>
          <div class="banner-info">
            <h1>Portal del Estudiante</h1>
            <p>Sistema de Gestión de Prácticas y Vinculación</p>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <a routerLink="/student/dashboard" routerLinkActive="active" class="nav-item">
              <span class="icon">🏠</span>
              <span>Dashboard</span>
            </a>
            
            <div class="nav-section">
              <div class="section-title">Mis Asignaturas</div>
              
              <a routerLink="/student/subjects/vinculation" routerLinkActive="active" class="nav-item sub-item">
                <span class="icon">🤝</span>
                <span>Vinculación</span>
              </a>
              
              <a routerLink="/student/subjects/dual-internship" routerLinkActive="active" class="nav-item sub-item">
                <span class="icon">🎓</span>
                <span>Prácticas Dual</span>
              </a>
              
              <a routerLink="/student/subjects/preprofessional-internship" routerLinkActive="active" class="nav-item sub-item">
                <span class="icon">💼</span>
                <span>Prácticas Preprofesionales</span>
              </a>
            </div>

            <a routerLink="/student/documents" routerLinkActive="active" class="nav-item">
              <span class="icon">📄</span>
              <span>Mis Documentos</span>
            </a>
          </nav>

          <div class="sidebar-footer">
            <button class="btn-logout" (click)="logout()">
              <span class="icon">🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .student-layout {
      min-height: 100vh;
      background: #f3f4f6;
    }

    .header-banner {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .banner-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 20px;

        .student-icon {
          font-size: 64px;
          line-height: 1;
        }

        .banner-info {
          h1 {
            font-size: 32px;
            color: white;
            font-weight: 700;
            margin: 0 0 8px 0;
          }

          p {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0;
          }
        }
      }
    }

    .content-wrapper {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px;
      gap: 32px;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .sidebar {
      width: 280px;
      background: white;
      border-radius: 12px;
      padding: 24px;
      height: fit-content;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 32px;

      @media (max-width: 768px) {
        width: 100%;
        position: static;
      }

      .sidebar-nav {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 24px;

        .nav-section {
          margin: 16px 0;

          .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 8px 16px;
            margin-bottom: 4px;
          }
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: #6b7280;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;

          &:hover {
            background: #d1fae5;
            color: #065f46;
          }

          &.active {
            background: #10b981;
            color: white;
          }

          &.sub-item {
            padding-left: 32px;
            font-size: 13px;
          }

          .icon {
            font-size: 20px;
          }
        }
      }

      .sidebar-footer {
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;

        .btn-logout {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 500;

          &:hover {
            background: rgba(239, 68, 68, 0.2);
          }

          .icon {
            font-size: 20px;
          }
        }
      }
    }

    .main-content {
      flex: 1;
      min-width: 0;
    }
  `]
})
export class StudentLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}