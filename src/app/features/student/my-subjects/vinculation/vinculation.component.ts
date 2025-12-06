import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VinculationService } from '../../../../core/services/vinculation.service';
import { Vinculation } from '../../../../core/models';

@Component({
  selector: 'app-vinculation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="vinculation-container">
      <div class="header">
        <div class="header-content">
          <div class="icon">🤝</div>
          <div>
            <h1>Vinculación con la Comunidad</h1>
            <p>160 horas de servicio comunitario</p>
          </div>
        </div>
      </div>

      <!-- Información del Proyecto -->
      <div class="info-card">
        <h2>📋 Información del Proyecto</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Horas Requeridas:</span>
            <span class="value">160 horas</span>
          </div>
          <div class="info-item">
            <span class="label">Estado:</span>
            <span class="badge active">En Curso</span>
          </div>
        </div>
      </div>

      <!-- Formulario de Vinculación -->
      <form [formGroup]="vinculationForm" (ngSubmit)="onSubmit()" class="vinculation-form">
        <div class="form-card">
          <h2>🏢 Datos de la Organización</h2>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="razonSocial">Razón Social *</label>
              <input
                type="text"
                id="razonSocial"
                formControlName="razonSocial"
                class="form-control"
                placeholder="Nombre de la organización"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="representanteLegal">Representante Legal *</label>
              <input
                type="text"
                id="representanteLegal"
                formControlName="representanteLegal"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="tutorEmpresarial">Tutor Empresarial *</label>
              <input
                type="text"
                id="tutorEmpresarial"
                formControlName="tutorEmpresarial"
                class="form-control"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label for="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                formControlName="telefono"
                class="form-control"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                formControlName="direccion"
                class="form-control"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="provincia">Provincia *</label>
              <select id="provincia" formControlName="provincia" class="form-control">
                <option value="">Seleccione</option>
                <option value="Pichincha">Pichincha</option>
                <option value="Guayas">Guayas</option>
                <option value="Azuay">Azuay</option>
              </select>
            </div>

            <div class="form-group">
              <label for="canton">Cantón *</label>
              <input type="text" id="canton" formControlName="canton" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="parroquia">Parroquia *</label>
              <input type="text" id="parroquia" formControlName="parroquia" class="form-control">
            </div>
          </div>
        </div>

        <div class="form-card">
          <h2>📅 Fechas del Proyecto</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Fecha de Inicio *</label>
              <input type="date" id="startDate" formControlName="startDate" class="form-control">
            </div>

            <div class="form-group">
              <label for="endDate">Fecha de Fin *</label>
              <input type="date" id="endDate" formControlName="endDate" class="form-control">
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" routerLink="/student/dashboard" class="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" [disabled]="vinculationForm.invalid || loading">
            <span *ngIf="!loading">💾 Guardar Información</span>
            <span *ngIf="loading">Guardando...</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    /* Estilos similares a evaluation-form */
    .vinculation-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      .header-content {
        display: flex;
        gap: 20px;
        align-items: center;

        .icon {
          font-size: 64px;
        }

        h1 {
          font-size: 32px;
          color: #1f2937;
          font-weight: 700;
          margin-bottom: 4px;
        }

        p {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }
      }
    }

    .info-card {
      background: #fffbeb;
      border: 2px solid #fbbf24;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;

      h2 {
        font-size: 18px;
        color: #92400e;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            font-size: 14px;
            color: #92400e;
            font-weight: 500;
          }

          .value {
            font-size: 16px;
            color: #78350f;
            font-weight: 700;
          }

          .badge {
            padding: 6px 12px;
            background: #d1fae5;
            color: #065f46;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
          }
        }
      }
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 18px;
        color: #1f2937;
        margin-bottom: 24px;
        font-weight: 600;
        padding-bottom: 16px;
        border-bottom: 2px solid #f3f4f6;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;

      &.full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }

      .form-control {
        padding: 12px 16px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        background-color: #f9fafb;

        &:focus {
          outline: none;
          border-color: #fbbf24;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column-reverse;
        button {
          width: 100%;
        }
      }
    }
  `]
})
export class VinculationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vinculationService = inject(VinculationService);

  vinculationForm: FormGroup;
  loading = false;

  constructor() {
    this.vinculationForm = this.fb.group({
      razonSocial: ['', Validators.required],
      representanteLegal: ['', Validators.required],
      tutorEmpresarial: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      parroquia: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Cargar datos si existen
  }

  onSubmit(): void {
    if (this.vinculationForm.invalid) return;

    this.loading = true;
    const data: Vinculation = this.vinculationForm.value;

    this.vinculationService.create(data).subscribe({
      next: () => {
        alert('Información guardada exitosamente');
        this.loading = false;
      },
      error: () => {
        alert('Error al guardar');
        this.loading = false;
      }
    });
  }
}