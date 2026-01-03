import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { TrainingAssignmentService } from '../../../../core/services/training-assignment.service';
import { UserService } from '../../../../core/services/user.service';
import { StudentService } from '../../../../core/services/student.service';
import { CareerService } from '../../../../core/services/career.service';
import { AcademicPeriodService } from '../../../../core/services/academic-period.service';

import {
  TrainingAssignment,
  TrainingType,
  User,
  Career,
  AcademicPeriod,
  Student
} from '../../../../core/models';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-assign-tutor',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule
  ],
  template: `
    <mat-card *ngIf="assignment">
      <mat-card-title>Asignación de Tutores</mat-card-title>

      <mat-card-content>

        <!-- INFO -->
        <div class="info">
          <p><strong>Estudiante:</strong>
            {{ studentUser?.person?.name }} {{ studentUser?.person?.lastname }}
          </p>
          <p><strong>Carrera:</strong> {{ career?.name }}</p>
          <p><strong>Periodo:</strong> {{ period?.name }}</p>
          <p><strong>Tipo:</strong> {{ typeLabel }}</p>
        </div>

        <!-- TUTOR ACADÉMICO -->
        <mat-form-field appearance="outline" class="full">
          <mat-label>Tutor Académico</mat-label>
          <mat-select [(value)]="assignment.tutorAcademicId">
            <mat-option [value]="null">Sin asignar</mat-option>
            <mat-option
              *ngFor="let t of academicTutors"
              [value]="t.id"
            >
              {{ t.person.name }} {{ t.person.lastname }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- TUTOR EMPRESARIAL -->
        <mat-form-field appearance="outline" class="full">
          <mat-label>Tutor Empresarial</mat-label>
          <mat-select [(value)]="assignment.tutorEnterpriseId">
            <mat-option [value]="null">Sin asignar</mat-option>
            <mat-option
              *ngFor="let t of enterpriseTutors"
              [value]="t.id"
            >
              {{ t.person.name }} {{ t.person.lastname }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- ACTIONS -->
        <div class="actions">
          <button mat-raised-button color="primary" (click)="save()">
            <mat-icon>save</mat-icon>
            Guardar
          </button>
        </div>

      </mat-card-content>
    </mat-card>
  `
})
export class AssignTutorComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private assignmentService = inject(TrainingAssignmentService);
  private userService = inject(UserService);
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  private periodService = inject(AcademicPeriodService);

  assignment!: TrainingAssignment;

  student?: Student;
  studentUser?: User;
  career?: Career;
  period?: AcademicPeriod;

  academicTutors: User[] = [];
  enterpriseTutors: User[] = [];

  typeLabel = '';

  ngOnInit(): void {
    const assignmentId = Number(this.route.snapshot.paramMap.get('id'));
    const assignment = this.assignmentService.getById(assignmentId);

    if (!assignment) return;

    this.assignment = assignment;

    this.student = this.studentService.getById(this.assignment.studentId);
    this.career = this.careerService.getById(this.assignment.careerId);
    this.period = this.periodService.getById(this.assignment.academicPeriodId);
    if (this.student) {
      this.studentUser = this.userService.getById(this.student.userId);
    }

    const users = this.userService.getAll();

    this.academicTutors = users.filter(u =>
      u.roles.some(r => r.name === 'TUTOR_ACADEMIC')
    );

    this.enterpriseTutors = users.filter(u =>
      u.roles.some(r => r.name === 'TUTOR_ENTERPRISE')
    );

    this.typeLabel = this.getTypeLabel(this.assignment.type);
  }

  save(): void {
    this.assignmentService.update(this.assignment);
    this.router.navigate(['/coordinator/students']);
  }

  private getTypeLabel(type: TrainingType): string {
    switch (type) {
      case 'VINCULATION': return 'Vinculación';
      case 'DUAL_PRACTICE': return 'Prácticas Dual';
      case 'PREPROFESSIONAL_PRACTICE': return 'Prácticas Preprofesionales';
      default: return '';
    }
  }
}
