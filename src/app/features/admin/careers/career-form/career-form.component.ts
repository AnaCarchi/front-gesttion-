import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CareerService } from '../../../../core/services/career.service';
import { Career } from '../../../../core/models';

@Component({
  selector: 'app-career-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="career-form-container">
      <div class="form-header">
        <a routerLink="/admin/careers" class="back-link">← Volver</a>
        <h1>{{ isEditMode ? 'Editar Carrera' : 'Nueva Carrera' }}</h1>
        <p>{{ isEditMode ? 'Modificar información de la carrera' : 'Crear una nueva carrera académica' }}</p>
      </div>

      <form [formGroup]="careerForm" (ngSubmit)="onSubmit()" class="career-form">
        <div class="form-card">
          <h2>Información de la Carrera</h2>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="name">Nombre de la Carrera *</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="form-control"
                placeholder="Ej: Desarrollo de Software"
                [class.is-invalid]="name?.invalid && name?.touched"
              >
              <div class="invalid-feedback" *ngIf="name?.invalid && name?.touched">
                <span *ngIf="name?.errors?.['required']">El nombre es requerido</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="description">Descripción</label>
              <textarea
                id="description"
                formControlName="description"
                class="form-control"
                rows="3"
                placeholder="Descripción de la carrera"
              ></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="isDual">Tipo de Carrera *</label>
              <select
                id="isDual"
                formControlName="isDual"
                class="form-control"
                [class.is-invalid]="isDual?.invalid && isDual?.touched"
              >
                <option value="">Seleccione el tipo</option>
                <option [value]="true">Carrera Dual</option>
                <option [value]="false">Carrera Tradicional</option>
              </select>
              <div class="invalid-feedback" *ngIf="isDual?.invalid && isDual?.touched">
                <span *ngIf="isDual?.errors?.['required']">El tipo es requerido</span>
              </div>
            </div>

            <div class="form-group">
              <label for="status">Estado *</label>
              <select
                id="status"
                formControlName="status"
                class="form-control"
                [class.is-invalid]="status?.invalid && status?.touched"
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <div class="invalid-feedback" *ngIf="status?.invalid && status?.touched">
                <span *ngIf="status?.errors?.['required']">El estado es requerido</span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <h3>ℹ️ Tipos de Carrera</h3>
            <ul>
              <li><strong>Dual:</strong> Incluye prácticas de formación dual (obligatorias/curriculares)</li>
              <li><strong>Tradicional:</strong> Incluye vinculación + prácticas preprofesionales (complementarias)</li>
            </ul>
          </div>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/admin/careers" class="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="careerForm.invalid || loading"
          >
            <span *ngIf="!loading">{{ isEditMode ? 'Actualizar' : 'Crear Carrera' }}</span>
            <span *ngIf="loading">{{ isEditMode ? 'Actualizando...' : 'Creando...' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    /* Similar a period-form.component.ts */
    .info-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 16px;
      margin-top: 20px;

      h3 {
        font-size: 14px;
        color: #1e40af;
        margin-bottom: 12px;
        font-weight: 600;
      }

      ul {
        margin: 0;
        padding-left: 20px;

        li {
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 8px;

          strong {
            font-weight: 600;
          }
        }
      }
    }
  `]
})
export class CareerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private careerService = inject(CareerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  careerForm: FormGroup;
  loading = false;
  errorMessage = '';
  isEditMode = false;
  careerId?: number;

  constructor() {
    this.careerForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isDual: ['', Validators.required],
      status: ['Activo', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.careerId = +params['id'];
        this.loadCareer(this.careerId);
      }
    });
  }

  private loadCareer(id: number): void {
    this.loading = true;
    this.careerService.getById(id).subscribe({
      next: (career) => {
        this.careerForm.patchValue({
          name: career.name,
          description: career.description,
          isDual: career.isDual,
          status: career.status
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar la carrera';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.careerForm.invalid) {
      this.markFormGroupTouched(this.careerForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const careerData: Career = {
      ...this.careerForm.value,
      id: this.careerId || 0
    };

    const request = this.isEditMode && this.careerId
      ? this.careerService.update(this.careerId, careerData)
      : this.careerService.create(careerData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/admin/careers']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al guardar la carrera';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get name() { return this.careerForm.get('name'); }
  get isDual() { return this.careerForm.get('isDual'); }
  get status() { return this.careerForm.get('status'); }
}