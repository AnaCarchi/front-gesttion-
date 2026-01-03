import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { AcademicPeriodService } from '../../../../core/services/academic-period.service';
import { TrainingAssignmentService } from '../../../../core/services/training-assignment.service';
import { CareerService } from '../../../../core/services/career.service';
import { StudentService } from '../../../../core/services/student.service';
import { UserService } from '../../../../core/services/user.service';

import {
  TrainingAssignment,
  TrainingType,
  AcademicPeriod,
  Career,
  Student,
  User
} from '../../../../core/models';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  template: `
    <div class="header">
      <h2>Estudiantes por Asignatura</h2>

      <mat-form-field appearance="outline">
        <mat-label>Filtrar por tipo</mat-label>
        <mat-select [(value)]="selectedType" (selectionChange)="applyFilter()">
          <mat-option value="">Todos</mat-option>
          <mat-option value="VINCULATION">Vinculación</mat-option>
          <mat-option value="DUAL_PRACTICE">Prácticas Dual</mat-option>
          <mat-option value="PREPROFESSIONAL_PRACTICE">Prácticas Preprofesionales</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <table mat-table [dataSource]="filteredAssignments" class="mat-elevation-z1">

      <ng-container matColumnDef="student">
        <th mat-header-cell *matHeaderCellDef>Estudiante</th>
        <td mat-cell *matCellDef="let a">
          {{ getStudentUser(a.studentId)?.person?.name }}
          {{ getStudentUser(a.studentId)?.person?.lastname }}
        </td>
      </ng-container>

      <ng-container matColumnDef="career">
        <th mat-header-cell *matHeaderCellDef>Carrera</th>
        <td mat-cell *matCellDef="let a">
          {{ getCareer(a.careerId)?.name }}
        </td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef>Tipo</th>
        <td mat-cell *matCellDef="let a">
          {{ getTypeLabel(a.type) }}
        </td>
      </ng-container>

      <ng-container matColumnDef="tutors">
        <th mat-header-cell *matHeaderCellDef>Tutores</th>
        <td mat-cell *matCellDef="let a">
          <span *ngIf="a.tutorAcademicId">Académico</span>
          <span *ngIf="!a.tutorAcademicId">—</span>
          /
          <span *ngIf="a.tutorEnterpriseId">Empresarial</span>
          <span *ngIf="!a.tutorEnterpriseId">—</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let a">
          <button
            mat-icon-button
            color="primary"
            (click)="assignTutor(a)"
          >
            <mat-icon>assignment_ind</mat-icon>
          </button>
          <button
  mat-raised-button
  color="primary"
  routerLink="/coordinator/students/bulk-upload"
>
  <mat-icon>upload_file</mat-icon>
  Carga Masiva
</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    table {
      width: 100%;
    }
  `]
})
export class StudentListComponent implements OnInit {

  private authService = inject(AuthService);
  private periodService = inject(AcademicPeriodService);
  private assignmentService = inject(TrainingAssignmentService);
  private careerService = inject(CareerService);
  private studentService = inject(StudentService);
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser!: User;
  activePeriod!: AcademicPeriod;

  assignments: TrainingAssignment[] = [];
  filteredAssignments: TrainingAssignment[] = [];

  students: Student[] = [];
  users: User[] = [];
  careers: Career[] = [];

  selectedType: TrainingType | '' = '';

  columns = ['student', 'career', 'type', 'tutors', 'actions'];

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()!;
    this.students = this.studentService.getAll();
    this.users = this.userService.getAll();
    this.careers = this.careerService.getAll();

    const periods = this.periodService.getAll();
    this.activePeriod = periods[periods.length - 1];

    const coordinatorCareerIds = this.currentUser.careerIds || [];

    this.assignments = this.assignmentService.getAll().filter(a =>
      a.academicPeriodId === this.activePeriod.id &&
      coordinatorCareerIds.includes(a.careerId)
    );

    this.filteredAssignments = [...this.assignments];
  }

  applyFilter(): void {
    if (!this.selectedType) {
      this.filteredAssignments = [...this.assignments];
      return;
    }

    this.filteredAssignments = this.assignments.filter(
      a => a.type === this.selectedType
    );
  }

  assignTutor(assignment: TrainingAssignment): void {
    this.router.navigate([
      '/coordinator/students',
      assignment.id,
      'assign-tutor'
    ]);
  }

  getStudentUser(id: number): User | undefined {
    const student = this.students.find(s => s.id === id);
    if (!student) return undefined;
    return this.users.find(u => u.id === student.userId);
  }

  getCareer(id: number): Career | undefined {
    return this.careers.find(c => c.id === id);
  }

  getTypeLabel(type: TrainingType): string {
    switch (type) {
      case 'VINCULATION': return 'Vinculación';
      case 'DUAL_PRACTICE': return 'Prácticas Dual';
      case 'PREPROFESSIONAL_PRACTICE': return 'Prácticas Preprofesionales';
      default: return '';
    }
  }
}
