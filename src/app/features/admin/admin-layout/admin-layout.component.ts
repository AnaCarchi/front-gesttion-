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
  selector: 'app-admin-layout',
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
          <mat-icon>school</mat-icon>
          <span>Administración</span>
        </div>

        <mat-nav-list>
          <a mat-list-item routerLink="dashboard">
            <mat-icon matListIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>

          <a mat-list-item routerLink="periods">
            <mat-icon matListIcon>date_range</mat-icon>
            <span>Periodos</span>
          </a>

          <a mat-list-item routerLink="careers">
            <mat-icon matListIcon>menu_book</mat-icon>
            <span>Carreras</span>
          </a>

          <a mat-list-item routerLink="users">
            <mat-icon matListIcon>group</mat-icon>
            <span>Usuarios</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <!-- CONTENT -->
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
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
    .layout {
      height: 100vh;
    }

    .sidenav {
      width: 240px;
      background: #0f172a;
      color: #fff;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      font-size: 18px;
      font-weight: bold;
    }

    mat-nav-list a {
      color: #e5e7eb;
    }

    mat-nav-list a mat-icon {
      color: #93c5fd;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .content {
      padding: 24px;
    }

    .spacer {
      flex: 1;
    }
  `]
})
export class AdminLayoutComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
