import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod } from '../../../../core/models';

@Component({
  selector: 'app-period-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="period-form-container">
      <h1>{{ isEditMode ? 'Editar Periodo Académico' : 'Nuevo Periodo Académico' }}</h1>

      <form [formGroup]="periodForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input id="name" formControlName="name" type="text" placeholder="Nombre del periodo">
          <div class="error" *ngIf="periodForm.get('name')?.invalid && periodForm.get('name')?.touched">
            El nombre es obligatorio.
          </div>
        </div>

        <div class="form-group">
          <label for="startDate">Fecha de Inicio</label>
          <input id="startDate" formControlName="startDate" type="date">
          <div class="error" *ngIf="periodForm.get('startDate')?.invalid && periodForm.get('startDate')?.touched">
            La fecha de inicio es obligatoria.
          </div>
        </div>

        <div class="form-group">
          <label for="endDate">Fecha de Fin</label>
          <input id="endDate" formControlName="endDate" type="date">
          <div class="error" *ngIf="periodForm.get('endDate')?.invalid && periodForm.get('endDate')?.touched">
            La fecha de fin es obligatoria.
          </div>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea id="description" formControlName="description" placeholder="Descripción del periodo"></textarea>
        </div>

        <div class="form-group">
          <label for="status">Estado</label>
          <select id="status" formControlName="status">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="periodForm.invalid">
          {{ isEditMode ? 'Actualizar Periodo' : 'Crear Periodo' }}
        </button>
        <a routerLink="/admin/periods" class="btn btn-outline">Cancelar</a>
      </form>

      <div class="error-message" *ngIf="errorMessage">
        ⚠️ {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
.period-form-container { max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #f1f5f9; border-radius: 14px; }
h1 { font-size: 24px; color: #0f172a; margin-bottom: 24px; }
.form-group { margin-bottom: 16px; display: flex; flex-direction: column; }
label { font-weight: 600; margin-bottom: 6px; color: #374151; }
input, textarea, select { padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; }
textarea { resize: vertical; min-height: 80px; }
.error { color: #dc2626; font-size: 12px; margin-top: 4px; }
.btn { padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; margin-right: 10px; margin-top: 10px; }
.btn-primary { background: #2563eb; color: #ffffff; border: none; }
.btn-primary:hover { background: #1d4ed8; }
.btn-outline { background: #ffffff; border: 1px solid #cbd5f5; color: #1e40af; }
.btn-outline:hover { background: #eff6ff; }
.error-message { margin-top: 16px; color: #991b1b; font-weight: 600; background: #fee2e2; padding: 12px; border-radius: 10px; }
  `]
})
export class PeriodFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private periodService = inject(PeriodService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  periodForm!: FormGroup;
  isEditMode = false;
  errorMessage = '';
  periodId?: number;

  ngOnInit(): void {
    this.periodForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
      status: ['Activo', Validators.required]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.periodId = +params['id'];
        this.isEditMode = true;
        this.loadPeriod(this.periodId);
      }
    });
  }

  private loadPeriod(id: number): void {
    this.periodService.getById(id).subscribe({
      next: (period) => this.periodForm.patchValue(period),
      error: (err) => {
        this.errorMessage = 'Error al cargar el periodo';
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.periodForm.invalid) return;

    const period: AcademicPeriod = this.periodForm.value;

    if (this.isEditMode && this.periodId) {
      this.periodService.update(this.periodId, period).subscribe({
        next: () => this.router.navigate(['/admin/periods']),
        error: (err) => {
          this.errorMessage = 'Error al actualizar el periodo';
          console.error(err);
        }
      });
    } else {
      this.periodService.create(period).subscribe({
        next: () => this.router.navigate(['/admin/periods']),
        error: (err) => {
          this.errorMessage = 'Error al crear el periodo';
          console.error(err);
        }
      });
    }
  }
}
