import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-coordinator-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="layout">

      <!-- SIDEBAR -->
      <mat-sidenav mode="side" opened class="sidenav">

        <div class="logo">
          <mat-icon>supervisor_account</mat-icon>
          <span>Coordinación</span>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="dashboard">
            <mat-icon matListIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>

          <a mat-list-item routerLink="students">
            <mat-icon matListIcon>school</mat-icon>
            <span>Estudiantes</span>
          </a>

          <a mat-list-item routerLink="tutors">
            <mat-icon matListIcon>groups</mat-icon>
            <span>Tutores</span>
          </a>

          <a mat-list-item routerLink="reports">
            <mat-icon matListIcon>bar_chart</mat-icon>
            <span>Reportes</span>
          </a>
        </mat-nav-list>

      </mat-sidenav>

      <!-- CONTENT -->
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span class="spacer"></span>
          <button mat-icon-button (click)="logout()">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>

    </mat-sidenav-container>
  `,
  styles: [`
    .layout { height: 100vh; }

    .sidenav {
      width: 260px;
      background: #0f172a;
      color: #fff;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      font-weight: bold;
      font-size: 18px;
    }

    mat-nav-list a {
      color: #e5e7eb;
    }

    mat-nav-list a mat-icon {
      color: #93c5fd;
    }

    .spacer { flex: 1; }

    .content {
      padding: 24px;
    }
  `]
})
export class CoordinatorLayoutComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
