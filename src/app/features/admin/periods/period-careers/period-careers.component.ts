import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod } from '../../../../core/models/academic-period.model';
import { Career } from '../../../../core/models/career.model';

@Component({
  selector: 'app-period-careers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="period-careers-container">
      <!-- HEADER -->
      <div class="header">
        <a routerLink="/admin/periods" class="back-link">
          <span class="material-icons">arrow_back</span> Volver a Periodos
        </a>
        <div class="header-content" *ngIf="period">
          <div>
            <h1>{{ period.name }}</h1>
            <p>Carreras asociadas al periodo académico</p>
          </div>
          <span class="period-status" [class.active]="period.status === 'Activo'">
            <span class="material-icons">
              {{ period.status === 'Activo' ? 'check_circle' : 'cancel' }}
            </span>
            {{ period.status }}
          </span>
        </div>
      </div>

      <!-- INFORMACIÓN DEL PERIODO -->
      <div class="period-info-card" *ngIf="period">
        <div class="info-grid">
          <div class="info-item">
            <span class="material-icons info-icon">event_available</span>
            <div>
              <span class="info-label">Fecha de Inicio</span>
              <span class="info-value">{{ period.startDate | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <div class="info-item">
            <span class="material-icons info-icon">event_busy</span>
            <div>
              <span class="info-label">Fecha de Fin</span>
              <span class="info-value">{{ period.endDate | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>

          <div class="info-item">
            <span class="material-icons info-icon">school</span>
            <div>
              <span class="info-label">Total Carreras</span>
              <span class="info-value">{{ careers.length }}</span>
            </div>
          </div>

          <div class="info-item">
            <span class="material-icons info-icon">fact_check</span>
            <div>
              <span class="info-label">Estado</span>
              <span class="badge" [class.active]="period.status === 'Activo'">
                {{ period.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="period-description" *ngIf="period.description">
          <h3><span class="material-icons">description</span> Descripción</h3>
          <p>{{ period.description }}</p>
        </div>
      </div>

      <!-- LOADING -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>

      <!-- CARRERAS -->
      <div class="careers-section" *ngIf="!loading">
        <div class="section-header">
          <h2><span class="material-icons">school</span> Carreras Asociadas</h2>
          <div class="career-stats">
            <span class="stat-badge dual">
              <span class="material-icons">sync_alt</span>
              {{ getDualCareersCount() }} Duales
            </span>
            <span class="stat-badge traditional">
              <span class="material-icons">menu_book</span>
              {{ getTraditionalCareersCount() }} Tradicionales
            </span>
          </div>
        </div>

        <div class="careers-grid" *ngIf="careers.length > 0; else emptyState">
          <div class="career-card" *ngFor="let career of careers">
            <div class="career-header">
              <span class="material-icons career-icon">{{ career.isDual ? 'sync_alt' : 'menu_book' }}</span>
              <div class="career-info">
                <h3>{{ career.name }}</h3>
                <span class="career-type" [class.dual]="career.isDual">
                  <span class="material-icons">
                    {{ career.isDual ? 'sync_alt' : 'menu_book' }}
                  </span>
                  {{ career.isDual ? 'Carrera Dual' : 'Carrera Tradicional' }}
                </span>
              </div>
              <span class="status-badge" [class.active]="career.status === 'Activo'">
                <span class="material-icons">
                  {{ career.status === 'Activo' ? 'check_circle' : 'cancel' }}
                </span>
                {{ career.status }}
              </span>
            </div>

            <div class="career-body" *ngIf="career.description">
              <p class="career-description">{{ career.description }}</p>
            </div>

            <div class="career-details">
              <h4><span class="material-icons">assignment</span> Tipos de Formación:</h4>
              <div class="formation-types">
                <div class="formation-badge vinculation">
                  <span class="material-icons">diversity_3</span>
                  Vinculación (160h)
                </div>
                <div class="formation-badge dual" *ngIf="career.isDual">
                  <span class="material-icons">work_outline</span>
                  Formación Dual
                </div>
                <div class="formation-badge prepro" *ngIf="!career.isDual">
                  <span class="material-icons">business_center</span>
                  Prácticas Preprofesionales
                </div>
              </div>
            </div>

            <div class="career-actions">
              <a [routerLink]="['/admin/careers', career.id, 'edit']" class="btn btn-sm btn-outline">
                <span class="material-icons">edit</span> Editar Carrera
              </a>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <ng-template #emptyState>
          <div class="empty-state">
            <span class="material-icons empty-icon">school</span>
            <h3>No hay carreras asociadas</h3>
            <p>Este periodo académico no tiene carreras registradas</p>
            <a routerLink="/admin/careers/new" class="btn btn-primary">
              <span class="material-icons">add_circle</span> Crear Primera Carrera
            </a>
          </div>
        </ng-template>
      </div>

      <!-- ERROR -->
      <div class="error-message" *ngIf="errorMessage">
        <span class="material-icons">error</span>
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.period-careers-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background-image:
    linear-gradient(
      rgba(15, 23, 42, 0.85),
      rgba(15, 23, 42, 0.85)
    ),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* ================= HEADER ================= */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 36px;
}

.back-link {
  color: #93c5fd;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #fbbf24;
}

.header-content h1 {
  font-size: 34px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.period-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
  background: rgba(239, 68, 68, 0.15);
  color: #fecaca;
}

.period-status.active {
  background: rgba(16, 185, 129, 0.15);
  color: #bbf7d0;
}

/* ================= INFO GRID ================= */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  margin-bottom: 28px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  font-size: 32px;
  color: #3b82f6;
}

.info-item span {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

/* ================= CAREER GRID ================= */
.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 24px;
}

/* ================= CAREER CARD ================= */
.career-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.career-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.35);
}

.career-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.career-icon {
  font-size: 32px;
  color: #2563eb;
}

.career-type {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.career-type.dual {
  color: #1e40af;
}

/* ================= ACTION BUTTONS ================= */
.career-actions {
  margin-top: 18px;
  text-align: right;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #f97316, #ea580c);
  transform: translateY(-3px);
}

.btn-outline {
  border: 2px solid #3b82f6;
  color: #3b82f6;
  background: transparent;
}

.btn-outline:hover {
  background: #eff6ff;
  transform: translateY(-3px);
}

/* ================= LOADING ================= */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px;
  color: white;
}

.spinner {
  width: 46px;
  height: 46px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ================= ERROR MESSAGE ================= */
.error-message {
  margin-top: 24px;
  padding: 14px 18px;
  background: rgba(239, 68, 68, 0.15);
  color: #fecaca;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  backdrop-filter: blur(6px);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .info-grid, .careers-grid {
    grid-template-columns: 1fr;
  }
}
`]

})
export class PeriodCareersComponent implements OnInit {
  private periodService = inject(PeriodService);
  private route = inject(ActivatedRoute);

  period?: AcademicPeriod;
  careers: Career[] = [];
  loading = true;
  errorMessage = '';
  periodId?: number;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.periodId = +params['id'];
        this.loadData();
      }
    });
  }

  private loadData(): void {
    if (!this.periodId) return;

    this.loading = true;
    this.errorMessage = '';

    this.periodService.getById(this.periodId).subscribe({
      next: (period) => (this.period = period),
      error: (error) => {
        console.error('Error al cargar periodo:', error);
        this.errorMessage = 'Error al cargar el periodo';
        this.loading = false;
      }
    });

    this.periodService.getCareers(this.periodId).subscribe({
      next: (careers) => {
        this.careers = careers ?? [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
        this.errorMessage = 'Error al cargar las carreras';
        this.loading = false;
      }
    });
  }

  getDualCareersCount(): number {
    return this.careers.filter(c => c.isDual).length;
  }

  getTraditionalCareersCount(): number {
    return this.careers.filter(c => !c.isDual).length;
  }
}
