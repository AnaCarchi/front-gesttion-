import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { CareerService } from '../../../core/services/career.service';

import { TrainingAssignment, TrainingType, AcademicPeriod, Career } from '../../../core/models';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-coordinator-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <h2>Reportes del Periodo</h2>

    <p *ngIf="activePeriod">
      Periodo activo:
      <strong>{{ activePeriod.name }}</strong>
    </p>

    <div class="grid">

      <mat-card class="card">
        <mat-icon>handshake</mat-icon>
        <h3>Vinculación</h3>
        <p>Total: {{ vinculationCount }}</p>
      </mat-card>

      <mat-card class="card">
        <mat-icon>engineering</mat-icon>
        <h3>Prácticas Dual</h3>
        <p>Total: {{ dualCount }}</p>
      </mat-card>

      <mat-card class="card">
        <mat-icon>work</mat-icon>
        <h3>Prácticas Preprofesionales</h3>
        <p>Total: {{ preprofessionalCount }}</p>
      </mat-card>

      <mat-card class="card approved">
        <mat-icon>check_circle</mat-icon>
        <h3>Aprobados</h3>
        <p>{{ approvedCount }}</p>
      </mat-card>

      <mat-card class="card failed">
        <mat-icon>cancel</mat-icon>
        <h3>Reprobados</h3>
        <p>{{ failedCount }}</p>
      </mat-card>

    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .card {
      padding: 16px;
      text-align: center;
    }

    .card mat-icon {
      font-size: 40px;
      color: #2563eb;
    }

    .approved mat-icon {
      color: #16a34a;
    }

    .failed mat-icon {
      color: #dc2626;
    }
  `]
})
export class ReportsComponent implements OnInit {

  private assignmentService = inject(TrainingAssignmentService);
  private periodService = inject(AcademicPeriodService);
  private careerService = inject(CareerService);

  activePeriod!: AcademicPeriod;

  vinculationCount = 0;
  dualCount = 0;
  preprofessionalCount = 0;
  approvedCount = 0;
  failedCount = 0;

  ngOnInit(): void {
    const periods = this.periodService.getAll();
    if (!periods.length) return;

    this.activePeriod = periods[periods.length - 1];

    const assignments = this.assignmentService.getAll().filter(a =>
      a.academicPeriodId === this.activePeriod.id
    );

    this.vinculationCount = assignments.filter(a => a.type === 'VINCULATION').length;
    this.dualCount = assignments.filter(a => a.type === 'DUAL_PRACTICE').length;
    this.preprofessionalCount = assignments.filter(a => a.type === 'PREPROFESSIONAL_PRACTICE').length;

    this.approvedCount = assignments.filter(a => a.status === 'APPROVED').length;
    this.failedCount = assignments.filter(a => a.status === 'FAILED').length;
  }
}
