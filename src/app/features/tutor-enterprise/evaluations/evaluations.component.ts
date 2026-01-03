import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingAssignmentService } from '../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../core/services/academic-period.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-enterprise-evaluations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Evaluaciones Realizadas</h2>

    <table *ngIf="evaluations.length; else empty">
      <tr>
        <th>Estudiante</th>
        <th>Tipo</th>
        <th>Nota</th>
        <th>Estado</th>
      </tr>
      <tr *ngFor="let e of evaluations">
        <td>{{ e.studentName }}</td>
        <td>{{ e.type }}</td>
        <td>{{ e.grade }}</td>
        <td>{{ e.status }}</td>
      </tr>
    </table>

    <ng-template #empty>
      <p>No hay evaluaciones registradas.</p>
    </ng-template>
  `
})
export class EvaluationsComponent implements OnInit {

  private assignmentService = inject(TrainingAssignmentService);
  private periodService = inject(AcademicPeriodService);
  private auth = inject(AuthService);

  evaluations: any[] = [];

  ngOnInit(): void {
    const tutor = this.auth.getCurrentUser();
    const period = this.periodService.getAll().slice(-1)[0];

    this.evaluations = this.assignmentService.getAll().filter(a =>
      a.enterpriseTutorId === tutor?.id &&
      a.academicPeriodId === period.id &&
      a.grade != null
    );
  }
}
