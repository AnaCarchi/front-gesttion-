import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CareerService } from '../../../../core/services/career.service';
import { AcademicPeriodService } from '../../../../core/services/academic-period.service';
import { Career, AcademicPeriod } from '../../../../core/models';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-career-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="header">
      <h2>Gestión de Carreras</h2>
      <button mat-raised-button color="primary" (click)="create()">
        <mat-icon>add</mat-icon>
        Nueva Carrera
      </button>
    </div>

    <table mat-table [dataSource]="careers" class="mat-elevation-z1">

      <!-- NOMBRE -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Carrera</th>
        <td mat-cell *matCellDef="let c">{{ c.name }}</td>
      </ng-container>

      <!-- TIPOS DE FORMACIÓN -->
      <ng-container matColumnDef="types">
        <th mat-header-cell *matHeaderCellDef>Formación</th>
        <td mat-cell *matCellDef="let c">
          <span *ngIf="c.hasVinculation">Vinculación </span>
          <span *ngIf="c.hasDualPractice">Dual </span>
          <span *ngIf="c.hasPreprofessionalPractice">Preprofesional</span>
        </td>
      </ng-container>

      <!-- PERIODO -->
      <ng-container matColumnDef="period">
        <th mat-header-cell *matHeaderCellDef>Periodo</th>
        <td mat-cell *matCellDef="let c">
          {{ getPeriodName(c.academicPeriodId) }}
        </td>
      </ng-container>

      <!-- ACCIONES -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let c">
          <button
            mat-icon-button
            color="primary"
            [routerLink]="['/admin/careers/edit', c.id]"
          >
            <mat-icon>edit</mat-icon>
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
export class CareerListComponent implements OnInit {

  private careerService = inject(CareerService);
  private periodService = inject(AcademicPeriodService);
  private router = inject(Router);

  careers: Career[] = [];
  periods: AcademicPeriod[] = [];

  columns = ['name', 'types', 'period', 'actions'];

  ngOnInit(): void {
    this.careers = this.careerService.getAll();
    this.periods = this.periodService.getAll();
  }

  getPeriodName(periodId: number): string {
    return this.periods.find(p => p.id === periodId)?.name || '—';
  }

  create(): void {
    this.router.navigate(['/admin/careers/new']);
  }
}
