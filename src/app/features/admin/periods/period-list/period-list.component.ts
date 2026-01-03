import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AcademicPeriodService } from '../../../../core/services/academic-period.service';
import { AcademicPeriod } from '../../../../core/models';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-period-list',
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
      <h2>Gestión de Periodos</h2>
      <button mat-raised-button color="primary" (click)="create()">
        <mat-icon>add</mat-icon>
        Nuevo Periodo
      </button>
    </div>

    <table mat-table [dataSource]="periods" class="mat-elevation-z1">

      <!-- NOMBRE -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Periodo</th>
        <td mat-cell *matCellDef="let p">{{ p.name }}</td>
      </ng-container>

      <!-- FECHAS -->
      <ng-container matColumnDef="dates">
        <th mat-header-cell *matHeaderCellDef>Fechas</th>
        <td mat-cell *matCellDef="let p">
          {{ p.startDate | date:'dd/MM/yyyy' }} -
          {{ p.endDate | date:'dd/MM/yyyy' }}
        </td>
      </ng-container>

      <!-- ACCIONES -->
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Acciones</th>
        <td mat-cell *matCellDef="let p">
          <button
            mat-icon-button
            color="primary"
            (click)="viewCareers(p)"
            title="Ver carreras"
          >
            <mat-icon>menu_book</mat-icon>
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
export class PeriodListComponent implements OnInit {

  private service = inject(AcademicPeriodService);
  private router = inject(Router);

  periods: AcademicPeriod[] = [];
  columns = ['name', 'dates', 'actions'];

  ngOnInit(): void {
    this.periods = this.service.getAll();
  }

  create(): void {
    this.router.navigate(['/admin/periods/new']);
  }

  viewCareers(period: AcademicPeriod): void {
    this.router.navigate(['/admin/periods', period.id, 'careers']);
  }
}
