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

      <!-- HEADER -->
      <div class="header">
        <div class="header-content">
          <span class="material-icons header-icon">handshake</span>
          <div>
            <h1>Vinculación con la Comunidad</h1>
            <p>160 horas de servicio comunitario</p>
          </div>
        </div>
      </div>

      <!-- INFO -->
      <div class="info-card">
        <h2>
          <span class="material-icons">info</span>
          Información del Proyecto
        </h2>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Horas requeridas</span>
            <span class="value">160 horas</span>
          </div>
          <div class="info-item">
            <span class="label">Estado</span>
            <span class="badge active">En curso</span>
          </div>
        </div>
      </div>

      <!-- FORMULARIO -->
      <form [formGroup]="vinculationForm" (ngSubmit)="onSubmit()" class="vinculation-form">

        <!-- ORGANIZACIÓN -->
        <div class="form-card">
          <h2>
            <span class="material-icons">apartment</span>
            Datos de la Organización
          </h2>

          <div class="form-row">
            <div class="form-group full-width">
              <label>Razón Social *</label>
              <input type="text" formControlName="razonSocial" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Representante Legal *</label>
              <input type="text" formControlName="representanteLegal" class="form-control">
            </div>

            <div class="form-group">
              <label>Tutor Empresarial *</label>
              <input type="text" formControlName="tutorEmpresarial" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email *</label>
              <input type="email" formControlName="email" class="form-control">
            </div>

            <div class="form-group">
              <label>Teléfono *</label>
              <input type="tel" formControlName="telefono" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label>Dirección *</label>
              <input type="text" formControlName="direccion" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Provincia *</label>
              <select formControlName="provincia" class="form-control">
                <option value="">Seleccione</option>
                <option>Pichincha</option>
                <option>Guayas</option>
                <option>Azuay</option>
              </select>
            </div>

            <div class="form-group">
              <label>Cantón *</label>
              <input type="text" formControlName="canton" class="form-control">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label>Parroquia *</label>
              <input type="text" formControlName="parroquia" class="form-control">
            </div>
          </div>
        </div>

        <!-- FECHAS -->
        <div class="form-card">
          <h2>
            <span class="material-icons">calendar_month</span>
            Fechas del Proyecto
          </h2>

          <div class="form-row">
            <div class="form-group">
              <label>Fecha de inicio *</label>
              <input type="date" formControlName="startDate" class="form-control">
            </div>

            <div class="form-group">
              <label>Fecha de fin *</label>
              <input type="date" formControlName="endDate" class="form-control">
            </div>
          </div>
        </div>

        <!-- BOTONES -->
        <div class="form-actions">
          <button type="button" routerLink="/student/dashboard" class="btn btn-secondary">
            Cancelar
          </button>

          <button type="submit" class="btn btn-primary" [disabled]="vinculationForm.invalid || loading">
            <span class="material-icons">save</span>
            Guardar información
          </button>
        </div>

      </form>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR ================= */
.vinculation-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
}

/* ================= HEADER ================= */
.header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 56px;
  color: #f59e0b;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
}

.header p {
  color: #64748b;
}

/* ================= INFO ================= */
.info-card {
  background: #fffbeb;
  border: 2px solid #f59e0b;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 32px;
}

.info-card h2 {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #92400e;
  font-size: 18px;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.label {
  font-weight: 500;
  color: #92400e;
}

.value {
  font-weight: 700;
  color: #78350f;
}

.badge.active {
  background: rgba(245,158,11,0.2);
  color: #92400e;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* ================= FORM ================= */
.form-card {
  background: white;
  border-radius: 14px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.form-card h2 {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 12px;
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
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
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
}

.form-control:focus {
  outline: none;
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
}

/* ================= BOTONES ================= */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
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

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.vinculationForm.invalid) return;

    this.loading = true;
    const data: Vinculation = this.vinculationForm.value;

    this.vinculationService.create(data).subscribe({
      next: () => {
        alert('Información guardada correctamente');
        this.loading = false;
      },
      error: () => {
        alert('Error al guardar');
        this.loading = false;
      }
    });
  }
}
