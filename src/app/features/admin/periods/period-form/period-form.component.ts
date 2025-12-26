import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod } from '../../../../core/models/academic-period.model';

@Component({
  selector: 'app-period-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <button (click)="goBack()" class="btn-back" title="Volver">
            <span class="material-icons">arrow_back</span>
          </button>
          <div class="header-content">
            <span class="material-icons header-icon">{{ isEditMode ? 'edit_note' : 'add_circle' }}</span>
            <div>
              <h1>{{ isEditMode ? 'Editar Periodo Académico' : 'Nuevo Periodo Académico' }}</h1>
              <p>{{ isEditMode ? 'Actualiza la información del periodo' : 'Completa los datos del nuevo periodo académico' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- FORM CARD -->
      <div class="form-card">
        <form (ngSubmit)="onSubmit()" #periodForm="ngForm">
          <!-- INFORMACIÓN BÁSICA -->
          <div class="form-section">
            <div class="section-header">
              <span class="material-icons section-icon">info</span>
              <h2>Información Básica</h2>
            </div>

            <div class="form-group">
              <label for="name"><span class="material-icons">label</span> Nombre del Periodo *</label>
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="period.name"
                placeholder="Ej: Periodo 2025-1"
                required
                #nameField="ngModel"
              />
              <div class="error-message" *ngIf="nameField.invalid && nameField.touched">
                <span class="material-icons">error_outline</span> Campo requerido
              </div>
            </div>

            <div class="form-group">
              <label for="description"><span class="material-icons">description</span> Descripción</label>
              <textarea
                id="description"
                name="description"
                [(ngModel)]="period.description"
                placeholder="Descripción opcional del periodo..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- FECHAS -->
          <div class="form-section">
            <div class="section-header">
              <span class="material-icons section-icon">calendar_month</span>
              <h2>Fechas del Periodo</h2>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="startDate"><span class="material-icons">event_available</span> Fecha de Inicio *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  [(ngModel)]="startDateString"
                  required
                  #startDateField="ngModel"
                />
                <div class="error-message" *ngIf="startDateField.invalid && startDateField.touched">
                  <span class="material-icons">error_outline</span> Seleccione una fecha válida
                </div>
              </div>

              <div class="form-group">
                <label for="endDate"><span class="material-icons">event_busy</span> Fecha de Fin *</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  [(ngModel)]="endDateString"
                  required
                  #endDateField="ngModel"
                />
                <div class="error-message" *ngIf="endDateField.invalid && endDateField.touched">
                  <span class="material-icons">error_outline</span> Seleccione una fecha válida
                </div>
              </div>
            </div>

            <div class="warning-box" *ngIf="startDateString && endDateString && !isDateRangeValid()">
              <span class="material-icons">warning</span> La fecha de fin debe ser posterior a la de inicio
            </div>
          </div>

          <!-- ESTADO -->
          <div class="form-section">
            <div class="section-header">
              <span class="material-icons section-icon">toggle_on</span>
              <h2>Estado del Periodo</h2>
            </div>

            <div class="form-group">
              <label for="status"><span class="material-icons">fact_check</span> Estado *</label>
              <div class="radio-group">
                <label class="radio-label active">
                  <input type="radio" name="status" value="Activo" [(ngModel)]="period.status" required />
                  <span class="material-icons">check_circle</span> Activo
                </label>
                <label class="radio-label inactive">
                  <input type="radio" name="status" value="Inactivo" [(ngModel)]="period.status" required />
                  <span class="material-icons">cancel</span> Inactivo
                </label>
              </div>
            </div>

            <div class="info-box">
              <span class="material-icons">info</span>
              {{
                period.status === 'Activo'
                  ? 'Un periodo activo permite asignar estudiantes y carreras.'
                  : 'Un periodo inactivo no permite nuevas asignaciones.'
              }}
            </div>
          </div>

          <!-- ACCIONES -->
          <div class="form-actions">
            <button type="button" (click)="goBack()" class="btn-secondary">
              <span class="material-icons">close</span> Cancelar
            </button>
            <button
              type="submit"
              class="btn-primary"
              [disabled]="!periodForm.valid || loading || !isDateRangeValid()"
            >
              <span class="material-icons" *ngIf="!loading">{{ isEditMode ? 'save' : 'add_circle' }}</span>
              <div class="spinner-small" *ngIf="loading"></div>
              {{ loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear') }} Periodo
            </button>
          </div>

          <div class="error-box" *ngIf="error">
            <span class="material-icons">error</span> {{ error }}
          </div>
        </form>
      </div>
    </div>
  `,
styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.page-container {
  max-width: 900px;
  margin: 3rem auto;
  padding: 2.5rem;
  font-family: 'Poppins', sans-serif;
  color: #f8fafc;
  background-image:
    linear-gradient(
      rgba(15, 23, 42, 0.85),
      rgba(15, 23, 42, 0.85)
    ),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  border-radius: 24px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
}

/* ================= HEADER ================= */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.btn-back {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ffffff;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.08);
}

.header-icon {
  font-size: 2.6rem;
  color: #fbbf24;
}

h1 {
  font-size: 1.8rem;
  margin: 0;
  color: #ffffff;
  font-weight: 800;
}

p {
  font-size: 0.95rem;
  color: #cbd5e1;
}

/* ================= SECCIONES ================= */
.form-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.form-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #fbbf24;
  margin-bottom: 1.2rem;
}

.section-icon {
  font-size: 1.8rem;
}

/* ================= INPUTS ================= */
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}

label {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  color: #e2e8f0;
}

input, textarea {
  padding: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  transition: border-color 0.3s ease, background 0.3s ease;
}

input:focus, textarea:focus {
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
}

.form-row {
  display: flex;
  gap: 1rem;
}

/* ================= MENSAJES ================= */
.error-message {
  color: #fca5a5;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.2rem;
}

.warning-box {
  background: rgba(234, 179, 8, 0.15);
  border: 1px solid rgba(250, 204, 21, 0.3);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #facc15;
  font-weight: 600;
}

.info-box {
  background: rgba(59, 130, 246, 0.15);
  border-left: 5px solid #3b82f6;
  padding: 1rem;
  border-radius: 10px;
  color: #bfdbfe;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.error-box {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(248, 113, 113, 0.3);
  padding: 1rem;
  border-radius: 10px;
  color: #fecaca;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* ================= BOTONES ================= */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1.2rem;
  margin-top: 1.5rem;
}

.btn-primary, .btn-secondary {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #f97316, #ea580c);
  transform: translateY(-3px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

/* ================= RADIO ================= */
.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  font-weight: 600;
  color: #e2e8f0;
}

.radio-label.active .material-icons {
  color: #22c55e;
}

.radio-label.inactive .material-icons {
  color: #ef4444;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .form-row {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
`]

})
export class PeriodFormComponent implements OnInit {
  private periodService = inject(PeriodService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  loading = false;
  error = '';
  periodId?: number;

  period: AcademicPeriod = {
    id: 0,
    name: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    status: 'Activo'
  };

  startDateString = '';
  endDateString = '';

  ngOnInit(): void {
    this.periodId = Number(this.route.snapshot.params['id']);
    if (this.periodId) {
      this.isEditMode = true;
      this.loadPeriod();
    } else {
      const today = new Date().toISOString().substring(0, 10);
      this.startDateString = today;
      this.endDateString = today;
    }
  }

  loadPeriod(): void {
    if (!this.periodId) return;
    this.loading = true;
    this.periodService.getById(this.periodId).subscribe({
      next: (period) => {
        this.period = period;
        this.startDateString = new Date(period.startDate).toISOString().substring(0, 10);
        this.endDateString = new Date(period.endDate).toISOString().substring(0, 10);
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el periodo.';
        this.loading = false;
      }
    });
  }

  isDateRangeValid(): boolean {
    if (!this.startDateString || !this.endDateString) return true;
    return new Date(this.endDateString) > new Date(this.startDateString);
  }

  onSubmit(): void {
    if (!this.isDateRangeValid()) {
      this.error = 'La fecha de fin debe ser posterior a la fecha de inicio';
      return;
    }

    this.loading = true;
    this.error = '';

    this.period.startDate = new Date(this.startDateString);
    this.period.endDate = new Date(this.endDateString);

    const operation = this.isEditMode
      ? this.periodService.update(this.period.id, this.period)
      : this.periodService.create(this.period);

    operation.subscribe({
      next: () => this.router.navigate(['/admin/periods']),
      error: () => {
        this.error = 'Error al guardar el periodo. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/periods']);
  }
}
