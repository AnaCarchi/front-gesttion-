import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';

import {
  AcademicPeriod,
  TrainingAssignment,
  User
} from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1>Panel del Estudiante</h1>

    <p class="period" *ngIf="activePeriod">
      Periodo activo:
      <strong>{{ activePeriod.name }}</strong>
    </p>

    <div class="subjects">

      <div class="subject-card" *ngIf="hasVinculation">
        <h3>Vinculación con la Comunidad</h3>
        <p>Formularios y documentos de vinculación</p>
        <a routerLink="/student/my-subjects/vinculation">
          Ingresar
        </a>
      </div>

      <div class="subject-card" *ngIf="hasDual">
        <h3>Prácticas de Formación Dual</h3>
        <p>Documentos y registros de prácticas duales</p>
        <a routerLink="/student/my-subjects/internship-dual">
          Ingresar
        </a>
      </div>

      <div class="subject-card" *ngIf="hasPreprofessional">
        <h3>Prácticas Preprofesionales</h3>
        <p>Formularios y documentos preprofesionales</p>
        <a routerLink="/student/my-subjects/internship-preprofessional">
          Ingresar
        </a>
      </div>

      <p *ngIf="!assignments.length" class="empty">
        No tienes asignaturas registradas en este periodo.
      </p>

    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: 8px;
    }

    .period {
      font-weight: 600;
      margin-bottom: 20px;
    }

    .subjects {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }

    .subject-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }

    .subject-card h3 {
      margin-bottom: 8px;
      color: #1f2937;
    }

    .subject-card p {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .subject-card a {
      color: #2563eb;
      font-weight: 600;
      text-decoration: none;
    }

    .empty {
      color: #6b7280;
      font-style: italic;
    }
  `]
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private periodService = inject(AcademicPeriodService);
  private assignmentService = inject(TrainingAssignmentService);

  student!: User;
  activePeriod?: AcademicPeriod;

  assignments: TrainingAssignment[] = [];

  hasVinculation = false;
  hasDual = false;
  hasPreprofessional = false;

  ngOnInit(): void {
    this.student = this.authService.getCurrentUser()!;
    const periods = this.periodService.getAll();

    if (!periods.length) return;

    this.activePeriod = periods[periods.length - 1];

    this.assignments = this.assignmentService.getAll().filter(a =>
      a.studentId === this.student.id &&
      a.academicPeriodId === this.activePeriod!.id
    );

    this.hasVinculation = this.assignments.some(a => a.type === 'VINCULATION');
    this.hasDual = this.assignments.some(a => a.type === 'DUAL_PRACTICE');
    this.hasPreprofessional = this.assignments.some(a => a.type === 'PREPROFESSIONAL_PRACTICE');
  }
}
