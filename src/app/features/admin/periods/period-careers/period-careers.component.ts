import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PeriodService } from '../../../../core/services/period.service';
import { AcademicPeriod, Career } from '../../../../core/models';

@Component({
  selector: 'app-period-careers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="period-careers-container">
      <div class="header">
        <a routerLink="/admin/periods" class="back-link">← Volver a Periodos</a>
        <div class="header-content" *ngIf="period">
          <div>
            <h1>{{ period.name }}</h1>
            <p>Carreras asociadas al periodo académico</p>
          </div>
          <span class="period-status" [class.active]="period.status === 'Activo'">
            {{ period.status }}
          </span>
        </div>
      </div>

      <!-- Información del Periodo -->
      <div class="period-info-card" *ngIf="period">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">📅 Fecha de Inicio</span>
            <span class="info-value">{{ period.startDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">📅 Fecha de Fin</span>
            <span class="info-value">{{ period.endDate | date:'dd/MM/yyyy' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">🎓 Total Carreras</span>
            <span class="info-value">{{ careers.length }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">📊 Estado</span>
            <span class="badge" [class.active]="period.status === 'Activo'">
              {{ period.status }}
            </span>
          </div>
        </div>
        <div class="period-description" *ngIf="period.description">
          <h3>Descripción</h3>
          <p>{{ period.description }}</p>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>

      <!-- Carreras del Periodo -->
      <div class="careers-section" *ngIf="!loading">
        <div class="section-header">
          <h2>🎓 Carreras Asociadas</h2>
          <div class="career-stats">
            <span class="stat-badge dual">
              {{ getDualCareersCount() }} Duales
            </span>
            <span class="stat-badge traditional">
              {{ getTraditionalCareersCount() }} Tradicionales
            </span>
          </div>
        </div>

        <div class="careers-grid" *ngIf="careers.length > 0">
          <div class="career-card" *ngFor="let career of careers">
            <div class="career-header">
              <div class="career-icon">
                {{ career.isDual ? '🎓' : '📚' }}
              </div>
              <div class="career-info">
                <h3>{{ career.name }}</h3>
                <span class="career-type" [class.dual]="career.isDual">
                  {{ career.isDual ? 'Carrera Dual' : 'Carrera Tradicional' }}
                </span>
              </div>
              <span class="status-badge" [class.active]="career.status === 'Activo'">
                {{ career.status }}
              </span>
            </div>

            <div class="career-body" *ngIf="career.description">
              <p class="career-description">{{ career.description }}</p>
            </div>

            <div class="career-details">
              <h4>Tipos de Formación Disponibles:</h4>
              <div class="formation-types">
                <div class="formation-badge vinculation">
                  <span class="badge-icon">🤝</span>
                  <span class="badge-text">Vinculación (160h)</span>
                </div>
                <div class="formation-badge" *ngIf="career.isDual" [class.dual]="career.isDual">
                  <span class="badge-icon">🎓</span>
                  <span class="badge-text">Prácticas Formación Dual</span>
                </div>
                <div class="formation-badge prepro" *ngIf="!career.isDual">
                  <span class="badge-icon">💼</span>
                  <span class="badge-text">Prácticas Preprofesionales</span>
                </div>
              </div>
            </div>

            <div class="career-actions">
              <a [routerLink]="['/admin/careers', career.id, 'edit']" class="btn btn-sm btn-outline">
                ✏️ Editar Carrera
              </a>
            </div>
          </div>
        </div>

        <!-- Estado Vacío -->
        <div class="empty-state" *ngIf="careers.length === 0">
          <div class="empty-icon">🎓</div>
          <h3>No hay carreras asociadas</h3>
          <p>Este periodo académico no tiene carreras registradas</p>
          <a routerLink="/admin/careers/new" class="btn btn-primary">
            Crear Primera Carrera
          </a>
        </div>
      </div>

      <!-- Estadísticas Adicionales -->
      <div class="stats-section" *ngIf="!loading && careers.length > 0">
        <h2>📊 Resumen del Periodo</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎓</div>
            <div class="stat-content">
              <div class="stat-label">Carreras Duales</div>
              <div class="stat-value">{{ getDualCareersCount() }}</div>
              <div class="stat-description">Prácticas formativas obligatorias</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-label">Carreras Tradicionales</div>
              <div class="stat-value">{{ getTraditionalCareersCount() }}</div>
              <div class="stat-description">Vinculación + Preprofesionales</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <div class="stat-label">Carreras Activas</div>
              <div class="stat-value">{{ getActiveCareersCount() }}</div>
              <div class="stat-description">En funcionamiento actual</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-label">Total Carreras</div>
              <div class="stat-value">{{ careers.length }}</div>
              <div class="stat-description">Registradas en el periodo</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .period-careers-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      .back-link {
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 16px;
        display: inline-block;

        &:hover {
          text-decoration: underline;
        }
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;

        h1 {
          font-size: 32px;
          color: #1f2937;
          margin-bottom: 8px;
          font-weight: 700;
        }

        p {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }

        .period-status {
          padding: 8px 16px;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;

          &.active {
            background: #d1fae5;
            color: #065f46;
          }
        }
      }
    }

    .period-info-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 24px;
        margin-bottom: 24px;
        padding-bottom: 24px;
        border-bottom: 2px solid #f3f4f6;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .info-label {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
          }

          .info-value {
            font-size: 18px;
            color: #1f2937;
            font-weight: 600;
          }

          .badge {
            display: inline-block;
            width: fit-content;
            padding: 6px 12px;
            background: #fee2e2;
            color: #991b1b;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;

            &.active {
              background: #d1fae5;
              color: #065f46;
            }
          }
        }
      }

      .period-description {
        h3 {
          font-size: 16px;
          color: #1f2937;
          margin-bottom: 12px;
          font-weight: 600;
        }

        p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }
      }
    }

    .careers-section {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h2 {
          font-size: 24px;
          color: #1f2937;
          font-weight: 600;
          margin: 0;
        }

        .career-stats {
          display: flex;
          gap: 12px;

          .stat-badge {
            padding: 6px 14px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;

            &.dual {
              background: #dbeafe;
              color: #1e40af;
            }

            &.traditional {
              background: #fef3c7;
              color: #92400e;
            }
          }
        }
      }
    }

    .careers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .career-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .career-header {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 24px 24px 20px;
        border-bottom: 2px solid #f3f4f6;

        .career-icon {
          font-size: 40px;
          flex-shrink: 0;
        }

        .career-info {
          flex: 1;
          min-width: 0;

          h3 {
            font-size: 18px;
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 8px;
            line-height: 1.3;
          }

          .career-type {
            display: inline-block;
            padding: 4px 10px;
            background: #fef3c7;
            color: #92400e;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;

            &.dual {
              background: #dbeafe;
              color: #1e40af;
            }
          }
        }

        .status-badge {
          padding: 6px 12px;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;

          &.active {
            background: #d1fae5;
            color: #065f46;
          }
        }
      }

      .career-body {
        padding: 20px 24px;

        .career-description {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }
      }

      .career-details {
        padding: 20px 24px;
        background: #f9fafb;

        h4 {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .formation-types {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .formation-badge {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            border-radius: 8px;
            border: 1.5px solid;

            &.vinculation {
              background: #fffbeb;
              border-color: #fbbf24;

              .badge-icon {
                color: #92400e;
              }

              .badge-text {
                color: #92400e;
                font-weight: 500;
              }
            }

            &.dual {
              background: #eff6ff;
              border-color: #3b82f6;

              .badge-icon {
                color: #1e40af;
              }

              .badge-text {
                color: #1e40af;
                font-weight: 500;
              }
            }

            &.prepro {
              background: #ecfdf5;
              border-color: #10b981;

              .badge-icon {
                color: #065f46;
              }

              .badge-text {
                color: #065f46;
                font-weight: 500;
              }
            }

            .badge-icon {
              font-size: 18px;
            }

            .badge-text {
              font-size: 13px;
            }
          }
        }
      }

      .career-actions {
        padding: 16px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      }
    }

    .stats-section {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        font-weight: 600;
        margin-bottom: 24px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
      }

      .stat-card {
        display: flex;
        gap: 16px;
        padding: 20px;
        background: #f9fafb;
        border-radius: 10px;
        border: 1.5px solid #e5e7eb;

        .stat-icon {
          font-size: 36px;
        }

        .stat-content {
          flex: 1;

          .stat-label {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
            margin-bottom: 6px;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 700;
            color: #1f2937;
            line-height: 1;
            margin-bottom: 6px;
          }

          .stat-description {
            font-size: 12px;
            color: #9ca3af;
          }
        }
      }
    }

    .empty-state, .loading-spinner {
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 8px;
      }

      p {
        color: #6b7280;
        margin-bottom: 24px;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 16px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: #fee2e2;
      color: #991b1b;
      padding: 16px 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
      border: 1px solid #fecaca;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
      }

      .info-grid {
        grid-template-columns: 1fr !important;
      }

      .careers-grid {
        grid-template-columns: 1fr !important;
      }

      .stats-grid {
        grid-template-columns: 1fr !important;
      }

      .career-stats {
        flex-direction: column;
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
    this.loading = true;
    this.errorMessage = '';

    // Cargar periodo
    this.periodService.getById(this.periodId!).subscribe({
      next: (period) => {
        this.period = period;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el periodo';
        console.error('Error:', error);
      }
    });

    // Cargar carreras del periodo
    this.periodService.getCareers(this.periodId!).subscribe({
      next: (careers) => {
        this.careers = careers;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las carreras';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  getDualCareersCount(): number {
    return this.careers.filter(c => c.isDual).length;
  }

  getTraditionalCareersCount(): number {
    return this.careers.filter(c => !c.isDual).length;
  }

  getActiveCareersCount(): number {
    return this.careers.filter(c => c.status === 'Activo').length;
  }
}