import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingAssignmentService } from '../../core/services/training-assignment.service';
import { AcademicPeriodService } from '../../core/services/academic-period.service';
import { AuthService } from '../../core/services/auth.service';

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
  period: any;

  ngOnInit(): void {
    const tutor = this.auth.getCurrentUser();
    const periods = this.periodService.getAll();
    this.period = periods[periods.length - 1];

    const assignments = this.assignmentService.getAll().filter(a =>
      a.academicTutorId === tutor?.id &&
      a.academicPeriodId === this.period.id
    );

    this.totalStudents = new Set(assignments.map(a => a.studentId)).size;
  }
}
