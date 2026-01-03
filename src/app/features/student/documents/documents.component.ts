import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';

import {
  AcademicPeriod,
  TrainingAssignment,
  User
} from '../../../core/models';

@Component({
  selector: 'app-student-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Mis Documentos</h2>

    <p *ngIf="activePeriod" class="period">
      Periodo activo:
      <strong>{{ activePeriod.name }}</strong>
    </p>

    <div *ngIf="documents.length; else noDocs">

      <table class="docs-table">
        <thead>
          <tr>
            <th>Asignatura</th>
            <th>Documento</th>
            <th>Fecha de carga</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let doc of documents">
            <td>{{ doc.typeLabel }}</td>
            <td>{{ doc.name }}</td>
            <td>{{ doc.uploadedAt | date:'short' }}</td>
          </tr>
        </tbody>
      </table>

    </div>

    <ng-template #noDocs>
      <p class="empty">
        No has cargado documentos en este periodo.
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

    .docs-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .docs-table th,
    .docs-table td {
      padding: 10px;
      border: 1px solid #e5e7eb;
      font-size: 14px;
    }

    .docs-table th {
      background: #f9fafb;
      text-align: left;
    }

    .empty {
      font-style: italic;
      color: #6b7280;
    }
  `]
})
export class DocumentsComponent implements OnInit {

  private authService = inject(AuthService);
  private periodService = inject(AcademicPeriodService);
  private assignmentService = inject(TrainingAssignmentService);

  student!: User;
  activePeriod?: AcademicPeriod;

  documents: {
    name: string;
    uploadedAt: Date;
    typeLabel: string;
  }[] = [];

  ngOnInit(): void {
    this.student = this.authService.getCurrentUser()!;
    const periods = this.periodService.getAll();

    if (!periods.length) return;

    this.activePeriod = periods[periods.length - 1];

    const assignments = this.assignmentService.getAll().filter(a =>
      a.studentId === this.student.id &&
      a.academicPeriodId === this.activePeriod!.id &&
      a.documents?.length
    );

    assignments.forEach(a => {
      a.documents!.forEach(doc => {
        this.documents.push({
          name: doc.name,
          uploadedAt: new Date(doc.uploadedAt),
          typeLabel: this.getTypeLabel(a.type)
        });
      });
    });
  }

  private getTypeLabel(type: string): string {
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
