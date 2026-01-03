import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <h1 class="title">Panel de Administración</h1>
    <p class="subtitle">Resumen general del sistema</p>

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
  `,
  styles: [`
    .title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .subtitle {
      color: #6b7280;
      margin-bottom: 24px;
    }

    .stat-card {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 16px;
      gap: 16px;
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

  ngOnInit(): void {
    this.totalPeriods = this.periodService.getAll().length;
    this.totalCareers = this.careerService.getAll().length;
    this.totalUsers = this.userService.getAll().length;
    this.totalStudents = this.studentService.getAll().length;
  }
}
