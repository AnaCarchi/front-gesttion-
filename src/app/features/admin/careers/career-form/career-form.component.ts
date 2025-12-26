import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CareerService } from '../../../../core/services/career.service';
import { Career } from '../../../../core/models/career.model';

@Component({
  selector: 'app-career-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-left">
          <button (click)="goBack()" class="btn-back">
            <span class="material-icons">arrow_back</span>
          </button>
          <span class="material-icons header-icon">{{ isEditMode ? 'edit' : 'add_box' }}</span>
          <div>
            <h1>{{ isEditMode ? 'Editar' : 'Nueva' }} Carrera</h1>
            <p>{{ isEditMode ? 'Actualiza los datos de la carrera' : 'Completa la información de la carrera' }}</p>
          </div>
        </div>
      </div>

      <!-- FORM CARD -->
      <div class="form-card">
        <form (ngSubmit)="onSubmit()" #careerForm="ngForm">
          <!-- BASIC INFO -->
          <div class="form-section">
            <div class="section-header">
              <span class="material-icons">info</span>
              <h2>Información Básica</h2>
            </div>

            <div class="form-row">
              <!-- CODE -->
              <div class="form-group">
                <label for="code">
                  <span class="material-icons">tag</span>
                  Código *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  [(ngModel)]="career.code"
                  placeholder="Ej: DS-2024"
                  required
                  #codeField="ngModel"
                  maxlength="20"
                />
                <div class="help-text">
                  <span class="material-icons">info</span>
                  Código único de la carrera
                </div>
                <div class="error-message" *ngIf="codeField.invalid && codeField.touched">
                  <span class="material-icons">error</span>
                  El código es requerido
                </div>
              </div>

              <!-- NAME -->
              <div class="form-group">
                <label for="name">
                  <span class="material-icons">school</span>
                  Nombre de la Carrera *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="career.name"
                  placeholder="Ej: Desarrollo de Software"
                  required
                  #nameField="ngModel"
                />
                <div class="error-message" *ngIf="nameField.invalid && nameField.touched">
                  <span class="material-icons">error</span>
                  El nombre es requerido
                </div>
              </div>
            </div>

            <!-- DESCRIPTION -->
            <div class="form-group">
              <label for="description">
                <span class="material-icons">description</span>
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                [(ngModel)]="career.description"
                placeholder="Descripción detallada de la carrera..."
                rows="4"
              ></textarea>
              <div class="help-text">
                <span class="material-icons">info</span>
                Describe los objetivos y perfil de la carrera
              </div>
            </div>
          </div>

          <!-- ADDITIONAL INFO -->
          <div class="form-section">
            <div class="section-header">
              <span class="material-icons">more_horiz</span>
              <h2>Información Adicional</h2>
            </div>

            <div class="info-card">
              <span class="material-icons">lightbulb</span>
              <div>
                <strong>Nota:</strong> Una vez creada la carrera, podrás asignarla a periodos académicos
                desde la gestión de periodos.
              </div>
            </div>
          </div>

          <!-- ACTIONS -->
          <div class="form-actions">
            <button type="button" (click)="goBack()" class="btn-secondary">
              <span class="material-icons">cancel</span>
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-primary" 
              [disabled]="!careerForm.valid || loading"
            >
              <span class="material-icons" *ngIf="!loading">{{ isEditMode ? 'save' : 'add_circle' }}</span>
              <div class="spinner-small" *ngIf="loading"></div>
              {{ loading ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear') }} Carrera
            </button>
          </div>

          <!-- ERROR -->
          <div class="error-box" *ngIf="error">
            <span class="material-icons">error</span>
            <span>{{ error }}</span>
          </div>

          <!-- SUCCESS -->
          <div class="success-box" *ngIf="success">
            <span class="material-icons">check_circle</span>
            <span>{{ success }}</span>
          </div>
        </form>
      </div>
    </div>
  `,
styles: [`
/* ================= CONTENEDOR ================= */
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 28px;
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.85)),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;
  font-family: 'Poppins', sans-serif;
}

/* ================= HEADER ================= */
.page-header {
  margin-bottom: 40px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 18px;
}

.btn-back {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}
.btn-back:hover {
  background: white;
  transform: translateX(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
.btn-back .material-icons {
  font-size: 26px;
  color: #e78709ff;
}

.header-icon {
  font-size: 52px;
  color: #e78709ff;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.page-header p {
  font-size: 15px;
  color: #e2e8f0;
  margin: 0;
}

/* ================= FORM CARD ================= */
.form-card {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ================= SECCIONES ================= */
.form-section {
  margin-bottom: 40px;
  padding-bottom: 32px;
  border-bottom: 2px solid #e2e8f0;
}
.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}
.section-header .material-icons {
  font-size: 28px;
  color: #e78709ff;
}
.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* ================= FORM GROUPS ================= */
.form-group {
  margin-bottom: 24px;
}
.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}
.form-group label .material-icons {
  font-size: 20px;
  color: #e78709ff;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #0f172a;
  background: #f8fafc;
  transition: all 0.3s;
  outline: none;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #e78709ff;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}
.form-group textarea {
  resize: vertical;
  min-height: 100px;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

/* ================= MESSAGES ================= */
.help-text,
.error-message,
.error-box,
.success-box,
.info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 8px;
}
.help-text {
  background: #f0f9ff;
  border: 2px solid #bae6fd;
  color: #0369a1;
}
.error-message,
.error-box {
  background: #fef2f2;
  border: 2px solid #ef4444;
  color: #b91c1c;
}
.success-box {
  background: #f0fdf4;
  border: 2px solid #e78709ff;
  color: #e78709ff;
}
.info-card {
  background: #fffbeb;
  border: 2px solid #fbbf24;
  color: #92400e;
  padding: 16px;
}

/* ================= ACTIONS ================= */
.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 40px;
}
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}
.btn-primary {
  background: linear-gradient(135deg, #e78709ff, #e78709ff);
  color: white;
  box-shadow: 0 10px 20px rgba(230, 145, 18, 0.35);
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #e78709ff, #e78709ff);
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(185, 112, 16, 0.45);
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
}
.btn-secondary:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

/* ================= SPINNER ================= */
.spinner-small {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .form-card { padding: 28px; }
  .form-row { grid-template-columns: 1fr; }
  .form-actions { flex-direction: column-reverse; }
  .btn-primary, .btn-secondary { width: 100%; }
}
`]

})
export class CareerFormComponent implements OnInit {
  private careerService = inject(CareerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  loading = false;
  error = '';
  success = '';
  careerId?: number;

  career: Career = {
  id: 0,
  code: '',
  name: '',
  description: '',
  isDual: false,
  status: 'Activo',
  students: []
};
  ngOnInit(): void {
    this.careerId = Number(this.route.snapshot.params['id']);
    if (this.careerId) {
      this.isEditMode = true;
      this.loadCareer();
    }
  }

  loadCareer(): void {
    if (!this.careerId) return;
    this.loading = true;

    this.careerService.getById(this.careerId).subscribe({
      next: (career) => {
        this.career = career;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading career:', error);
        this.error = 'Error al cargar la carrera';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    const operation = this.isEditMode
      ? this.careerService.update(this.career.id, this.career)
      : this.careerService.create(this.career);

    operation.subscribe({
      next: () => {
        this.success = this.isEditMode
          ? 'Carrera actualizada exitosamente'
          : 'Carrera creada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/admin/careers']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error saving career:', error);
        this.error = 'Error al guardar la carrera. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/careers']);
  }
}
