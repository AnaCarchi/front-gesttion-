import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { AuthService } from '../../../core/services/auth.service';

import {
  TrainingAssignment,
  AcademicPeriod,
  User
} from '../../../core/models';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Mis Estudiantes</h2>

    <table *ngIf="assignments.length; else empty">
      <tr>
        <th>Estudiante</th>
        <th>Empresa</th>
        <th>Tipo</th>
        <th>Evaluar</th>
      </tr>
      <tr *ngFor="let a of assignments">
        <td>{{ a.studentName }}</td>
        <td>{{ a.enterpriseName || '-' }}</td>
        <td>{{ a.type }}</td>
        <td>
          <a [routerLink]="['/tutor/evaluate', a.id]">Evaluar</a>
        </td>
      </tr>
    </table>

    <ng-template #empty>
      <p>No tienes estudiantes asignados.</p>
    </ng-template>
  `
})
export class MyStudentsComponent implements OnInit {

  private assignmentService = inject(TrainingAssignmentService);
  private periodService = inject(AcademicPeriodService);
  private auth = inject(AuthService);

  assignments: TrainingAssignment[] = [];

  ngOnInit(): void {
    const tutor: User | null = this.auth.getCurrentUser();
    if (!tutor) return;

    const periods: AcademicPeriod[] = this.periodService.getAll();
    if (periods.length === 0) return;

    const period = periods[periods.length - 1];

    this.assignments = this.assignmentService.getAll().filter(
      (a: TrainingAssignment) =>
        a.tutorAcademicId === tutor.id &&
        a.academicPeriodId === period.id
    );
  }
}
