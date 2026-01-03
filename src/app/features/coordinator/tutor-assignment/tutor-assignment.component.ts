import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../../core/services/user.service';
import { StudentService } from '../../../../core/services/student.service';
import { CareerService } from '../../../../core/services/career.service';
import { AcademicPeriodService } from '../../../../core/services/academic-period.service';
import { TrainingAssignmentService } from '../../../../core/services/training-assignment.service';

import {
  Student,
  Career,
  AcademicPeriod,
  TrainingAssignment
} from '../../../../core/models';

@Component({
  selector: 'app-assign-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Asignación de Tutores</h2>

    <p *ngIf="activePeriod">
      Periodo activo: <strong>{{ activePeriod.name }}</strong>
    </p>

    <!-- Selección de carrera -->
    <label>Carrera</label>
    <select [(ngModel)]="selectedCareerId" (change)="loadStudents()">
      <option value="">-- Seleccione --</option>
      <option *ngFor="let c of careers" [value]="c.id">
        {{ c.name }}
      </option>
    </select>

    <table *ngIf="students.length">
      <thead>
        <tr>
          <th>Estudiante</th>
          <th>Tutor Empresarial</th>
          <th>Tutor Académico</th>
          <th>Guardar</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let s of students">
          <td>{{ getStudentName(s) }}</td>

          <td>
            <select [(ngModel)]="enterpriseTutorMap[s.id]">
              <option value="">-- Seleccione --</option>
              <option *ngFor="let t of enterpriseTutors" [value]="t.id">
                {{ t.person?.name }} {{ t.person?.lastname }}
              </option>
            </select>
          </td>

          <td>
            <select [(ngModel)]="academicTutorMap[s.id]">
              <option value="">-- Seleccione --</option>
              <option *ngFor="let t of academicTutors" [value]="t.id">
                {{ t.person?.name }} {{ t.person?.lastname }}
              </option>
            </select>
          </td>

          <td>
            <button (click)="assignTutors(s)">Guardar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p *ngIf="!students.length && selectedCareerId">
      No hay estudiantes para esta carrera.
    </p>
  `,
  styles: [`
    label {
      display: block;
      margin-top: 12px;
      font-weight: 600;
    }
    select {
      padding: 6px;
      margin: 6px 0 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      font-size: 14px;
    }
    th {
      background: #f9fafb;
    }
    button {
      padding: 6px 12px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  `]
})
export class AssignTutorComponent implements OnInit {

  private userService = inject(UserService);
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  private periodService = inject(AcademicPeriodService);
  private assignmentService = inject(TrainingAssignmentService);

  activePeriod!: AcademicPeriod;

  careers: Career[] = [];
  students: Student[] = [];

  enterpriseTutors: any[] = [];
  academicTutors: any[] = [];

  selectedCareerId: number | '' = '';

  enterpriseTutorMap: Record<number, number> = {};
  academicTutorMap: Record<number, number> = {};

  ngOnInit(): void {
    this.activePeriod = this.periodService.getActive()!;
    this.careers = this.careerService.getByPeriod(this.activePeriod.id);

    const users = this.userService.getAll();
    this.enterpriseTutors = users.filter(u =>
      u.roles?.some(r => r.name === 'TUTOR_ENTERPRISE')
    );
    this.academicTutors = users.filter(u =>
      u.roles?.some(r => r.name === 'TUTOR_ACADEMIC')
    );
  }

  loadStudents(): void {
    if (!this.selectedCareerId) {
      this.students = [];
      return;
    }

    this.students = this.studentService.getAll().filter(s =>
      s.careerId === Number(this.selectedCareerId) &&
      s.academicPeriodId === this.activePeriod.id
    );
  }

  assignTutors(student: Student): void {
    const enterpriseTutorId = this.enterpriseTutorMap[student.id];
    const academicTutorId = this.academicTutorMap[student.id];

    if (!enterpriseTutorId && !academicTutorId) return;

    const assignment: TrainingAssignment = {
      id: 0,
      studentId: student.id,
      studentName: this.getStudentName(student),
      careerId: student.careerId,
      academicPeriodId: student.academicPeriodId,
      type: this.getTrainingType(student),
      enterpriseTutorId,
      academicTutorId
    };

    this.assignmentService.create(assignment);
    alert('Tutores asignados correctamente');
  }

  getStudentName(student: Student): string {
    const user = this.userService.getById(student.userId);
    return user
      ? `${user.person?.name} ${user.person?.lastname}`
      : '—';
  }

  getTrainingType(student: Student): any {
    if (student.hasDualPractice) return 'DUAL_PRACTICE';
    if (student.hasPreprofessionalPractice) return 'PREPROFESSIONAL_PRACTICE';
    return 'VINCULATION';
  }
}
