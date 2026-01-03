import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { CareerService } from '../../../core/services/career.service';
import { UserService } from '../../../core/services/user.service';
import { StudentService } from '../../../core/services/student.service';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <section class="header">
      <div>
        <h1 class="title">Panel de Administración</h1>
        <p class="subtitle">Resumen general del sistema y accesos rápidos</p>
      </div>
      <div class="active-period" *ngIf="activePeriodName">
        <span class="material-icons">event</span>
        Periodo activo: <strong>{{ activePeriodName }}</strong>
      </div>
    </section>

    <mat-grid-list cols="4" rowHeight="140px" gutterSize="16px">

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon color="primary">date_range</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ totalPeriods }}</span>
            <span class="stat-label">Periodos</span>
          </div>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon color="accent">menu_book</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ totalCareers }}</span>
            <span class="stat-label">Carreras</span>
          </div>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon color="warn">group</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ totalUsers }}</span>
            <span class="stat-label">Usuarios</span>
          </div>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon>school</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{ totalStudents }}</span>
            <span class="stat-label">Estudiantes</span>
          </div>
        </mat-card>
      </mat-grid-tile>

    </mat-grid-list>

    <section class="quick-actions">
      <h2 class="section-title">
        <span class="material-icons">dashboard_customize</span>
        Acciones rápidas
      </h2>

      <div class="action-grid">
        <a class="action-card" routerLink="/admin/periods">
          <span class="material-icons">event_available</span>
          <div>
            <h3>Gestión de Periodos</h3>
            <p>Crea periodos y administra sus carreras y tipos de formación.</p>
          </div>
        </a>

        <a class="action-card" routerLink="/admin/careers">
          <span class="material-icons">school</span>
          <div>
            <h3>Gestión de Carreras</h3>
            <p>Organiza carreras y define sus programas formativos.</p>
          </div>
        </a>

        <a class="action-card" routerLink="/admin/users">
          <span class="material-icons">manage_accounts</span>
          <div>
            <h3>Gestión de Usuarios</h3>
            <p>Alta, edición y roles para tutores, coordinadores y estudiantes.</p>
          </div>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .subtitle {
      color: #6b7280;
      margin-bottom: 0;
    }

    .active-period {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--secondary-soft);
      color: #a15415;
      padding: 8px 12px;
      border-radius: 12px;
      font-weight: 600;
    }

    .stat-card {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 16px;
      gap: 16px;
      border-radius: 16px;
      background: var(--bg-primary);
    }

    .stat-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 26px;
      font-weight: bold;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
    }

    .quick-actions {
      margin-top: 32px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      margin-bottom: 16px;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .action-card {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: var(--bg-primary);
      border-radius: 16px;
      box-shadow: var(--box-shadow);
      border: 1px solid var(--border-color);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 18px rgba(123, 182, 245, 0.2);
      text-decoration: none;
    }

    .action-card .material-icons {
      color: var(--secondary-color);
      font-size: 28px;
    }

    .action-card h3 {
      margin: 0 0 6px;
      font-size: 16px;
    }

    .action-card p {
      margin: 0;
      color: #6b7280;
      font-size: 13px;
    }
  `]
})
export class DashboardComponent implements OnInit {

  private periodService = inject(AcademicPeriodService);
  private careerService = inject(CareerService);
  private userService = inject(UserService);
  private studentService = inject(StudentService);

  totalPeriods = 0;
  totalCareers = 0;
  totalUsers = 0;
  totalStudents = 0;
  activePeriodName = '';

  ngOnInit(): void {
    this.totalPeriods = this.periodService.getAll().length;
    this.totalCareers = this.careerService.getAll().length;
    this.totalUsers = this.userService.getAll().length;
    this.totalStudents = this.studentService.getAll().length;
    this.activePeriodName = this.periodService.getActive()?.name ?? '';
  }
}
