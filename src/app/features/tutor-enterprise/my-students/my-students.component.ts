import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TrainingAssignmentService } from '../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../core/services/academic-period.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-enterprise-my-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h2>Mis Estudiantes</h2>

    <table *ngIf="assignments.length; else empty">
      <tr>
        <th>Estudiante</th>
        <th>Tipo</th>
        <th>Estado</th>
        <th>Evaluar</th>
      </tr>
      <tr *ngFor="let a of assignments">
        <td>{{ a.studentName }}</td>
        <td>{{ a.type }}</td>
        <td>{{ a.status }}</td>
        <td>
          <a [routerLink]="['/tutor-enterprise/evaluate', a.id]">
            Evaluar
          </a>
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

  assignments: any[] = [];

  ngOnInit(): void {
    const tutor = this.auth.getCurrentUser();
    const period = this.periodService.getAll().slice(-1)[0];

    this.assignments = this.assignmentService.getAll().filter(a =>
      a.enterpriseTutorId === tutor?.id &&
      a.academicPeriodId === period.id
    );
  }
}
