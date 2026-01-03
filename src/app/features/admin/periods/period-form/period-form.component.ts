import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AcademicPeriodService } from '../../../../core/services/academic-period.service';
import { AcademicPeriod } from '../../../../core/models';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-period-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule
  ],
  template: `
    <mat-card>
      <mat-card-title>Nuevo Periodo</mat-card-title>

      <mat-card-content>
        <form (ngSubmit)="save()">

          <mat-form-field appearance="outline" class="full">
            <mat-label>Nombre</mat-label>
            <input matInput [(ngModel)]="period.name" name="name" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Fecha Inicio</mat-label>
            <input matInput type="date"
              [(ngModel)]="period.startDate"
              name="startDate"
              required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Fecha Fin</mat-label>
            <input matInput type="date"
              [(ngModel)]="period.endDate"
              name="endDate"
              required />
          </mat-form-field>

          <div class="actions">
            <button mat-raised-button color="primary">
              <mat-icon>save</mat-icon>
              Guardar
            </button>
          </div>

        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full { width: 100%; }
    .actions {
      margin-top: 16px;
      text-align: right;
    }
  `]
})
export class PeriodFormComponent {

  private service = inject(AcademicPeriodService);
  private router = inject(Router);

  period: AcademicPeriod = {
  id: 0,
  name: '',
  startDate: '',
  endDate: '',
  isActive: true
};

  save(): void {
    this.service.create(this.period);
    this.router.navigate(['admin/periods']);
  }
}
