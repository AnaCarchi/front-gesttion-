import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CareerService } from '../../../../core/services/career.service';
import { AcademicPeriodService } from '../../../../core/services/academic-period.service';
import { Career, AcademicPeriod } from '../../../../core/models';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-career-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule
  ],
  template: `
    <mat-card>
      <mat-card-title>Nueva Carrera</mat-card-title>

      <mat-card-content>
        <form (ngSubmit)="save()">

          <!-- NOMBRE -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>Nombre</mat-label>
            <input
              matInput
              [(ngModel)]="career.name"
              name="name"
              required
            />
          </mat-form-field>

          <!-- PERIODO -->
          <mat-form-field appearance="outline" class="full">
            <mat-label>Periodo Académico</mat-label>
            <mat-select
              [(ngModel)]="career.academicPeriodId"
              name="academicPeriodId"
              required
            >
              <mat-option
                *ngFor="let p of periods"
                [value]="p.id"
              >
                {{ p.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- TIPOS DE FORMACIÓN -->
          <div class="checks">
            <mat-checkbox
              [(ngModel)]="career.hasVinculation"
              name="hasVinculation"
            >
              Vinculación
            </mat-checkbox>

            <mat-checkbox
            [(ngModel)]="career.hasDualInternship"
            name="hasDualInternship">
            Prácticas Formación Dual
          </mat-checkbox>
          <mat-checkbox
          [(ngModel)]="career.hasPreprofessional"
          name="hasPreprofessional"
          >
          Prácticas Preprofesionales
        </mat-checkbox>

          </div>

          <!-- ACCIONES -->
          <div class="actions">
            <button
              mat-raised-button
              color="primary"
              type="submit"
            >
              <mat-icon>save</mat-icon>
              Guardar
            </button>
          </div>

        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .full {
      width: 100%;
    }
    .checks {
      display: flex;
      gap: 16px;
      margin: 16px 0;
      flex-wrap: wrap;
    }
    .actions {
      text-align: right;
    }
  `]
})
export class CareerFormComponent implements OnInit {

  private careerService = inject(CareerService);
  private periodService = inject(AcademicPeriodService);
  private router = inject(Router);

  periods: AcademicPeriod[] = [];

  career: Career = {
  id: 0,
  name: '',
  academicPeriodId: 0,
  hasVinculation: false,
  hasDualInternship: false,
  hasPreprofessional: false
};


  ngOnInit(): void {
    this.periods = this.periodService.getAll();
  }

  save(): void {
    this.careerService.create(this.career);
    this.router.navigate(['/admin/careers']);
  }
}
