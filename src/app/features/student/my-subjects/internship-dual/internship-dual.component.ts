import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/services/auth.service';
import { AcademicPeriodService } from '../../../../core/services/academic-period.service';
import { TrainingAssignmentService } from '../../../../core/services/training-assignment.service';

import {
  AcademicPeriod,
  TrainingAssignment,
  User
} from '../../../../core/models';

@Component({
  selector: 'app-internship-dual',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Prácticas de Formación Dual</h2>

    <p *ngIf="activePeriod" class="period">
      Periodo activo:
      <strong>{{ activePeriod.name }}</strong>
    </p>

    <div *ngIf="assignment; else noDual">

      <p>
        <strong>Estado:</strong>
        {{ assignment.status }}
      </p>

      <p>
        <strong>Empresa formadora:</strong>
        {{ assignment.enterpriseName || 'No asignada' }}
      </p>

      <div class="upload">
        <label>Subir documento</label>
        <input type="file" (change)="uploadDocument($event)" />
      </div>

      <div class="documents" *ngIf="assignment.documents?.length">
        <h4>Documentos cargados</h4>
        <ul>
          <li *ngFor="let doc of assignment.documents">
            {{ doc.name }} — {{ doc.uploadedAt | date:'short' }}
          </li>
        </ul>
      </div>

    </div>

    <ng-template #noDual>
      <p class="empty">
        No tienes prácticas de formación dual asignadas en este periodo.
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

    .upload {
      margin-top: 16px;
    }

    .upload label {
      display: block;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .documents {
      margin-top: 16px;
    }

    .documents ul {
      padding-left: 18px;
    }

    .documents li {
      font-size: 14px;
      color: #374151;
    }

    .empty {
      font-style: italic;
      color: #6b7280;
    }
  `]
})
export class InternshipDualComponent implements OnInit {

  private authService = inject(AuthService);
  private periodService = inject(AcademicPeriodService);
  private assignmentService = inject(TrainingAssignmentService);

  student!: User;
  activePeriod?: AcademicPeriod;
  assignment?: TrainingAssignment;

  ngOnInit(): void {
    this.student = this.authService.getCurrentUser()!;
    const periods = this.periodService.getAll();

    if (!periods.length) return;

    this.activePeriod = periods[periods.length - 1];

    this.assignment = this.assignmentService.getAll().find(a =>
      a.studentId === this.student.id &&
      a.academicPeriodId === this.activePeriod!.id &&
      a.type === 'DUAL_PRACTICE'
    );
  }

  uploadDocument(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !this.assignment) return;

    const fileName = input.files[0].name;

    this.assignment.documents = this.assignment.documents || [];
    this.assignment.documents.push({
      name: fileName,
      uploadedAt: new Date()
    });

    this.assignmentService.update(this.assignment);
  }
}
