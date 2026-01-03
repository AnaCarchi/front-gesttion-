import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tutor-evaluations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Evaluaciones Académicas</h2>

    <p *ngIf="activePeriod" class="period">
      Periodo activo:
      <strong>{{ activePeriod.name }}</strong>
    </p>

    <table *ngIf="evaluations.length; else empty" class="table">
      <thead>
        <tr>
          <th>Estudiante</th>
          <th>Empresa</th>
          <th>Tipo</th>
          <th>Nota</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let e of evaluations">
          <td>{{ e.studentName }}</td>
          <td>{{ e.enterpriseName || '—' }}</td>
          <td>{{ getTypeLabel(e.type) }}</td>
          <td>{{ e.grade }}</td>
          <td>
            <span [class.approved]="e.status === 'APPROVED'"
                  [class.failed]="e.status === 'FAILED'">
              {{ e.status }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #empty>
      <p class="empty">
        No existen evaluaciones registradas en este periodo.
      </p>
    </ng-template>
  `,
  styles: [`
    h2 {
      margin-bottom: 8px;
    }

    .period {
      font-weight: 600;
      margin-bottom: 16px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .table th,
    .table td {
      padding: 10px;
      border: 1px solid #e5e7eb;
      font-size: 14px;
    }

    .table th {
      background: #f9fafb;
      text-align: left;
    }

    .approved {
      color: #16a34a;
      font-weight: 600;
    }

    .failed {
      color: #dc2626;
      font-weight: 600;
    }

    .empty {
      font-style: italic;
      color: #6b7280;
    }
  `]
})
export class EvaluationsComponent implements OnInit {

  private assignmentService = inject(TrainingAssignmentService);
  private periodService = inject(AcademicPeriodService);
  private authService = inject(AuthService);

  evaluations: any[] = [];
  activePeriod: any;

  ngOnInit(): void {
    const tutor = this.authService.getCurrentUser();
    const periods = this.periodService.getAll();

    if (!periods.length || !tutor) return;

    this.activePeriod = periods[periods.length - 1];

    this.evaluations = this.assignmentService.getAll().filter(a =>
      a.academicTutorId === tutor.id &&
      a.academicPeriodId === this.activePeriod.id &&
      a.grade != null
    );
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'VINCULATION':
        return 'Vinculación';
      case 'DUAL_PRACTICE':
        return 'Prácticas Formación Dual';
      case 'PREPROFESSIONAL_PRACTICE':
        return 'Prácticas Preprofesionales';
      default:
        return '';
    }
  }
}
