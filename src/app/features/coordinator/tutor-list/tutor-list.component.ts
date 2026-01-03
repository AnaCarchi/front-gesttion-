import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../../core/services/user.service';
import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';

import { User, TrainingAssignment } from '../../../core/models';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  template: `
    <h2>Listado de Tutores</h2>

    <table mat-table [dataSource]="tutors" class="mat-elevation-z1">

      <!-- NOMBRE -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Tutor</th>
        <td mat-cell *matCellDef="let t">
          {{ t.fullName }}
        </td>
      </ng-container>

      <!-- TIPO -->
      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef>Tipo</th>
        <td mat-cell *matCellDef="let t">
          <span *ngIf="isAcademic(t)">Académico</span>
          <span *ngIf="isEnterprise(t)">Empresarial</span>
        </td>
      </ng-container>

      <!-- ASIGNACIONES -->
      <ng-container matColumnDef="assignments">
        <th mat-header-cell *matHeaderCellDef>Asignaciones</th>
        <td mat-cell *matCellDef="let t">
          {{ getAssignmentCount(t) }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
  styles: [`
    table {
      width: 100%;
      margin-top: 16px;
    }
  `]
})
export class TutorListComponent implements OnInit {

  private userService = inject(UserService);
  private assignmentService = inject(TrainingAssignmentService);

  tutors: User[] = [];
  assignments: TrainingAssignment[] = [];

  columns = ['name', 'type', 'assignments'];

  ngOnInit(): void {
    const users = this.userService.getAll();
    this.assignments = this.assignmentService.getAll();

    // ✅ Tutores académicos y empresariales
    this.tutors = users.filter(u =>
      u.roles?.some(r => r.name === 'TUTOR_ACADEMIC') ||
      u.roles?.some(r => r.name === 'TUTOR_ENTERPRISE')
    );
  }

  isAcademic(user: User): boolean {
    return user.roles?.some(r => r.name === 'TUTOR_ACADEMIC');
  }

  isEnterprise(user: User): boolean {
    return user.roles?.some(r => r.name === 'TUTOR_ENTERPRISE');
  }

  getAssignmentCount(user: User): number {
    if (this.isAcademic(user)) {
      return this.assignments.filter(
        a => a.tutorAcademicId === user.id
      ).length;
    }

    if (this.isEnterprise(user)) {
      return this.assignments.filter(
        a => a.tutorEnterpriseId === user.id
      ).length;
    }

    return 0;
  }
}
