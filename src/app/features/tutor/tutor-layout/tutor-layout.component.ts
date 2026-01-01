import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tutor-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
<div class="tutor-layout" [class.collapsed]="isCollapsed">

  <!-- SIDEBAR -->
  <aside class="sidebar">

    <!-- HEADER -->
    <div class="sidebar-header">
      <img
        src="https://ignug.yavirac.edu.ec/assets/images/web/logo_login.png"
        class="logo-img"
        alt="Yavirac Logo"
      />
      <span class="logo-text">Yavirac</span>

      <button class="btn-toggle" (click)="toggleSidebar()" aria-label="Toggle sidebar">
        <span class="material-icons">
          {{ isCollapsed ? 'menu_open' : 'menu' }}
        </span>
      </button>
    </div>

    <!-- NAV -->
    <nav class="sidebar-nav">

      <a routerLink="/tutor/dashboard" routerLinkActive="active" class="nav-item">
        <span class="material-icons">dashboard</span>
        <span class="nav-text">Dashboard</span>
      </a>

      <a routerLink="/tutor/my-students" routerLinkActive="active" class="nav-item">
        <span class="material-icons">people</span>
        <span class="nav-text">Mis Estudiantes</span>
      </a>

      <a routerLink="/tutor/evaluations" routerLinkActive="active" class="nav-item">
        <span class="material-icons">assignment</span>
        <span class="nav-text">Evaluaciones</span>
      </a>

    </nav>

    <!-- FOOTER -->
    <div class="sidebar-footer">
      <button class="btn-logout" (click)="logout()">
        <span class="material-icons">logout</span>
        <span class="nav-text">Cerrar sesión</span>
      </button>
    </div>

  </aside>

  <!-- MAIN CONTENT -->
  <main class="main-content">
    <header class="top-bar">
      <h2>Portal del Tutor Empresarial</h2>

      <div class="user-info">
        <span class="material-icons">business</span>
        <span>Tutor Empresarial</span>
      </div>
    </header>

    <div class="content-area">
      <router-outlet></router-outlet>
    </div>
  </main>

</div>
`,
  styles: [`
/* ================= GENERAL ================= */
.tutor-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
  font-family: 'Segoe UI', sans-serif;
}

/* ================= SIDEBAR ================= */
.sidebar {
  width: 260px;
  background: #0f172a;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  transition: width 0.3s ease;
}

/* ================= HEADER ================= */
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-img {
  width: 40px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #f97316;
  white-space: nowrap;
}

.btn-toggle {
  margin-left: auto;
  background: none;
  border: none;
  color: #cbd5f5;
  cursor: pointer;
}

/* ================= NAV ================= */
.sidebar-nav {
  flex: 1;
  padding: 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  color: #cbd5f5;
  text-decoration: none;
  margin-bottom: 6px;
  transition: all 0.25s ease;
}

.nav-item .material-icons {
  font-size: 22px;
}

.nav-item:hover {
  background: rgba(59,130,246,0.15);
  color: #fff;
  transform: translateX(4px);
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

/* ================= FOOTER ================= */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(249,115,22,0.15);
  color: #f97316;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-logout:hover {
  background: rgba(249,115,22,0.3);
}

/* ================= MAIN ================= */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

/* ================= TOP BAR ================= */
.top-bar {
  background: white;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
}

.top-bar h2 {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2563eb;
  font-weight: 500;
}

/* ================= CONTENT ================= */
.content-area {
  padding: 32px;
}

/* ================= COLLAPSED ================= */
.tutor-layout.collapsed .sidebar {
  width: 80px;
}

.tutor-layout.collapsed .main-content {
  margin-left: 80px;
}

.tutor-layout.collapsed .logo-text,
.tutor-layout.collapsed .nav-text {
  display: none;
}

.tutor-layout.collapsed .nav-item,
.tutor-layout.collapsed .btn-logout {
  justify-content: center;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .tutor-layout.collapsed .sidebar {
    width: 70px;
  }
}
  `]
})
export class TutorLayoutComponent {

  private authService = inject(AuthService);

  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}
