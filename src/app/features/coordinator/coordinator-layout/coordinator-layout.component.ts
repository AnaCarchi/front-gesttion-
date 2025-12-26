import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-coordinator-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
  <div class="coordinator-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" fill="#3b82f6"/>
            <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="20" font-weight="bold">Y</text>
          </svg>
          <span>Yavirac</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/coordinator/dashboard" routerLinkActive="active" class="nav-item">
          <span class="material-icons">dashboard</span>
          <span>Dashboard</span>
        </a>

        <a routerLink="/coordinator/students" routerLinkActive="active" class="nav-item">
          <span class="material-icons">groups</span>
          <span>Estudiantes</span>
        </a>

        <a routerLink="/coordinator/reports" routerLinkActive="active" class="nav-item">
          <span class="material-icons">description</span>
          <span>Reportes</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-logout" (click)="logout()">
          <span class="material-icons">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <h2>Panel de Coordinador</h2>
        <div class="user-info">
          <span class="material-icons">school</span>
          <span>Coordinador de Carrera</span>
        </div>
      </header>

      <div class="content-area">
        <router-outlet></router-outlet>
      </div>
    </main>
  </div>
`,
  styles: [`
/* ================= LAYOUT GENERAL ================= */
.coordinator-layout {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ================= SIDEBAR ================= */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #0f172a, #020617);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  box-shadow: 4px 0 20px rgba(0,0,0,0.35);
}

/* ================= SIDEBAR HEADER ================= */
.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 800;
  color: #fbbf24;
}

/* ================= NAVEGACIÓN ================= */
.sidebar-nav {
  flex: 1;
  padding: 18px 14px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  margin-bottom: 8px;
  border-radius: 14px;
  color: #cbd5f5;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease;
}

.nav-item .material-icons {
  font-size: 22px;
  color: #94a3b8;
}

.nav-item:hover {
  background: rgba(59,130,246,0.15);
  color: #ffffff;
  transform: translateX(4px);
}

.nav-item:hover .material-icons {
  color: #ffffff;
}

.nav-item.active {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  box-shadow: 0 10px 25px rgba(37,99,235,0.45);
}

.nav-item.active .material-icons {
  color: #ffffff;
}

/* ================= FOOTER SIDEBAR ================= */
.sidebar-footer {
  padding: 18px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(239,68,68,0.15);
  color: #fecaca;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.25s ease;
}

.btn-logout .material-icons {
  font-size: 22px;
}

.btn-logout:hover {
  background: rgba(239,68,68,0.35);
  color: #ffffff;
}

/* ================= CONTENIDO PRINCIPAL ================= */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

/* ================= TOP BAR ================= */
.top-bar {
  background: #ffffff;
  padding: 22px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.top-bar h2 {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

/* ================= INFO USUARIO ================= */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #eff6ff;
  padding: 10px 14px;
  border-radius: 12px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
}

.user-info .material-icons {
  font-size: 20px;
}

/* ================= CONTENIDO ================= */
.content-area {
  flex: 1;
  padding: 32px;
}

/* ================= SCROLL BAR ================= */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.25);
  border-radius: 10px;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .sidebar {
    width: 74px;
  }

  .logo span,
  .nav-item span:not(.material-icons),
  .btn-logout span:not(.material-icons) {
    display: none;
  }

  .main-content {
    margin-left: 74px;
  }

  .nav-item,
  .btn-logout {
    justify-content: center;
  }

  .top-bar {
    padding: 18px 22px;
  }

  .content-area {
    padding: 20px;
  }
}
`]
})
export class CoordinatorLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}