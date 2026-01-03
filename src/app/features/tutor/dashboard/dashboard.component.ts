import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../../core/services/academic-period.service';
import { AuthService } from '../../../core/services/auth.service';

import {
  TrainingAssignment,
  AcademicPeriod,
  User
} from '../../../core/models';

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard Tutor Académico</h1>

    <p *ngIf="period">
      Periodo activo: <strong>{{ period.name }}</strong>
    </p>

    <p>
      Total estudiantes asignados:
      <strong>{{ totalStudents }}</strong>
    </p>
  `
})
export class DashboardComponent implements OnInit {

  private assignmentService = inject(TrainingAssignmentService);
  private periodService = inject(AcademicPeriodService);
  private auth = inject(AuthService);

  totalStudents = 0;
  period: AcademicPeriod | null = null;

  ngOnInit(): void {
    const tutor: User | null = this.auth.getCurrentUser();
    if (!tutor) return;

    const periods: AcademicPeriod[] = this.periodService.getAll();
    if (periods.length === 0) return;

    this.period = periods[periods.length - 1];

    const assignments: TrainingAssignment[] =
      this.assignmentService.getAll().filter(
        (a: TrainingAssignment) =>
        a.tutorAcademicId === tutor.id &&
        a.academicPeriodId === this.period!.id
    );

    this.totalStudents =
      new Set(assignments.map((a: TrainingAssignment) => a.studentId)).size;
  }
}
