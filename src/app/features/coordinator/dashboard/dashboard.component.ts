import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { CareerService } from '../../../core/services/career.service';
import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';
import { StudentService } from '../../../core/services/student.service';

import { AcademicPeriod, Career, TrainingAssignment, TrainingType, User } from '../../../core/models';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatGridListModule],
  template: `
    <div class="header">
      <div class="title">
        <h1>Dashboard Coordinador</h1>
        <p *ngIf="activePeriod">
          Periodo activo: <strong>{{ activePeriod.name }}</strong>
        </p>
        <p *ngIf="!activePeriod" class="warn">
          No hay periodos registrados. Pida al administrador crear un periodo.
        </p>
      </div>
      <div class="quick-actions">
        <a class="action-chip" routerLink="/coordinator/students">
          <span class="material-icons">supervisor_account</span>
          Estudiantes
        </a>
        <a class="action-chip" routerLink="/coordinator/tutors">
          <span class="material-icons">badge</span>
          Tutores
        </a>
        <a class="action-chip" routerLink="/coordinator/reports">
          <span class="material-icons">analytics</span>
          Reportes
        </a>
      </div>
    </div>

    <mat-grid-list cols="4" rowHeight="140px" gutterSize="16px">

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon>menu_book</mat-icon>
          <div class="info">
            <span class="value">{{ careersCount }}</span>
            <span class="label">Carreras asignadas</span>
          </div>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon>school</mat-icon>
          <div class="info">
            <span class="value">{{ studentsCount }}</span>
            <span class="label">Estudiantes</span>
          </div>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon>handshake</mat-icon>
          <div class="info">
            <span class="value">{{ vinculationCount }}</span>
            <span class="label">Vinculación</span>
          </div>
        </mat-card>
      </mat-grid-tile>

      <mat-grid-tile>
        <mat-card class="stat-card">
          <mat-icon>engineering</mat-icon>
          <div class="info">
            <span class="value">{{ dualCount }}</span>
            <span class="label">Prácticas Dual</span>
          </div>
        </mat-card>
      </mat-grid-tile>

    </mat-grid-list>

    <div class="second-row">
      <mat-card class="stat-card wide">
        <mat-icon>work</mat-icon>
        <div class="info">
          <span class="value">{{ preprofessionalCount }}</span>
          <span class="label">Prácticas Preprofesionales</span>
        </div>
      </mat-card>

      <mat-card class="stat-card wide">
        <mat-icon>assignment_turned_in</mat-icon>
        <div class="info">
          <span class="value">{{ approvedCount }}</span>
          <span class="label">Aprobados</span>
        </div>
      </mat-card>

      <mat-card class="stat-card wide">
        <mat-icon>cancel</mat-icon>
        <div class="info">
          <span class="value">{{ failedCount }}</span>
          <span class="label">Reprobados</span>
        </div>
      </mat-card>
    </div>

    <section class="assignment-section">
      <h2>
        <span class="material-icons">assignment</span>
        Gestión rápida
      </h2>
      <div class="assignment-grid">
        <div class="assignment-card">
          <span class="material-icons">task_alt</span>
          <div>
            <h3>Asignar tutores</h3>
            <p>Gestiona tutores académicos y empresariales por estudiante.</p>
          </div>
          <a class="btn btn-primary btn-sm" routerLink="/coordinator/tutor-assignments">
            Ir
          </a>
        </div>
        <div class="assignment-card">
          <span class="material-icons">filter_alt</span>
          <div>
            <h3>Filtrar estudiantes</h3>
            <p>Revisa por vinculación, dual o preprofesionales.</p>
          </div>
          <a class="btn btn-outline btn-sm" routerLink="/coordinator/students">
            Ver listado
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .title h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
    }

    .warn {
      color: #b45309;
    }

    .quick-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .action-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border-radius: 999px;
      background: var(--secondary-soft);
      color: #a15415;
      font-weight: 600;
      font-size: 13px;
      border: 1px solid #f6d7b8;
    }

    .action-chip .material-icons {
      font-size: 16px;
    }

    .stat-card {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 16px;
      background: var(--bg-primary);
    }

    .stat-card mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--primary-color);
    }

    .info {
      display: flex;
      flex-direction: column;
    }

    .value {
      font-size: 26px;
      font-weight: 800;
    }

    .label {
      color: #6b7280;
      font-size: 14px;
    }

    .second-row {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }

    .wide mat-icon {
      color: var(--secondary-color);
    }

    .assignment-section {
      margin-top: 28px;
    }

    .assignment-section h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      margin-bottom: 12px;
    }

    .assignment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 16px;
    }

    .assignment-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      align-items: center;
      background: var(--bg-primary);
      border-radius: 16px;
      padding: 16px;
      border: 1px solid var(--border-color);
      box-shadow: var(--box-shadow);
    }

    .assignment-card .material-icons {
      color: var(--primary-color);
      font-size: 28px;
    }

    .assignment-card h3 {
      margin: 0 0 6px;
      font-size: 16px;
    }

    .assignment-card p {
      margin: 0;
      color: #6b7280;
      font-size: 13px;
    }

    .assignment-card .btn {
      grid-column: span 2;
      justify-self: flex-start;
      margin-top: 8px;
    }
  `]
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private periodService = inject(AcademicPeriodService);
  private careerService = inject(CareerService);
  private studentService = inject(StudentService);
  private assignmentService = inject(TrainingAssignmentService);

  activePeriod: AcademicPeriod | null = null;
  currentUser: User | null = null;

  careersCount = 0;
  studentsCount = 0;

  vinculationCount = 0;
  dualCount = 0;
  preprofessionalCount = 0;

  approvedCount = 0;
  failedCount = 0;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    const periods = this.periodService.getAll();
    this.activePeriod = periods.length ? periods[periods.length - 1] : null;

    if (!this.currentUser || !this.currentUser.careerIds || this.currentUser.careerIds.length === 0) {
      this.resetCounts();
      return;
    }

    const coordinatorCareerIds = this.currentUser.careerIds;

    // Carreras asignadas al coordinador
    const careers = this.careerService.getAll().filter(c => coordinatorCareerIds.includes(c.id));
    this.careersCount = careers.length;

    // Asignaciones del periodo activo (si existe)
    const assignments = this.activePeriod
      ? this.assignmentService.getAll().filter(a =>
          a.academicPeriodId === this.activePeriod!.id &&
          coordinatorCareerIds.includes(a.careerId)
        )
      : [];

    // Estudiantes únicos por asignación
    const uniqueStudentIds = new Set(assignments.map(a => a.studentId));
    this.studentsCount = uniqueStudentIds.size;

    // Conteos por tipo
    this.vinculationCount = this.countByType(assignments, 'VINCULATION');
    this.dualCount = this.countByType(assignments, 'DUAL_PRACTICE');
    this.preprofessionalCount = this.countByType(assignments, 'PREPROFESSIONAL_PRACTICE');

    // Aprobados / Reprobados
    this.approvedCount = assignments.filter(a => a.status === 'APPROVED').length;
    this.failedCount = assignments.filter(a => a.status === 'FAILED').length;
  }

  private countByType(assignments: TrainingAssignment[], type: TrainingType): number {
    return assignments.filter(a => a.type === type).length;
  }

  private resetCounts(): void {
    this.careersCount = 0;
    this.studentsCount = 0;
    this.vinculationCount = 0;
    this.dualCount = 0;
    this.preprofessionalCount = 0;
    this.approvedCount = 0;
    this.failedCount = 0;
  }
}
