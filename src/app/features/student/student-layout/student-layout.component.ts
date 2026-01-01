import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
<div class="student-layout" [class.collapsed]="isCollapsed">

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

      <a routerLink="/student/dashboard" routerLinkActive="active" class="nav-item">
        <span class="material-icons">home</span>
        <span class="nav-text">Dashboard</span>
      </a>

      <div class="nav-section">
        <div class="section-title">Mis Asignaturas</div>

        <a
          routerLink="/student/subjects/vinculation"
          routerLinkActive="active"
          class="nav-item sub-item">
          <span class="material-icons">handshake</span>
          <span class="nav-text">Vinculación</span>
        </a>

        <a
          routerLink="/student/subjects/dual-internship"
          routerLinkActive="active"
          class="nav-item sub-item">
          <span class="material-icons">school</span>
          <span class="nav-text">Prácticas Dual</span>
        </a>

        <a
          routerLink="/student/subjects/preprofessional-internship"
          routerLinkActive="active"
          class="nav-item sub-item">
          <span class="material-icons">work</span>
          <span class="nav-text">Prácticas Preprofesionales</span>
        </a>
      </div>

      <a routerLink="/student/documents" routerLinkActive="active" class="nav-item">
        <span class="material-icons">description</span>
        <span class="nav-text">Mis Documentos</span>
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
    <router-outlet></router-outlet>
  </main>

</div>
`,
  styles: [`
/* ================= GENERAL ================= */
.student-layout {
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

.nav-section {
  margin: 16px 0 8px;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  padding: 8px 16px;
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

.sub-item {
  padding-left: 36px;
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
  padding: 32px;
  transition: margin-left 0.3s ease;
}

/* ================= COLLAPSED ================= */
.student-layout.collapsed .sidebar {
  width: 80px;
}

.student-layout.collapsed .main-content {
  margin-left: 80px;
}

.student-layout.collapsed .logo-text,
.student-layout.collapsed .nav-text,
.student-layout.collapsed .section-title {
  display: none;
}

.student-layout.collapsed .nav-item,
.student-layout.collapsed .btn-logout {
  justify-content: center;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .student-layout.collapsed .sidebar {
    width: 70px;
  }

  .main-content {
    padding: 20px;
  }
}
  `]
})
export class StudentLayoutComponent {

  private authService = inject(AuthService);

  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}