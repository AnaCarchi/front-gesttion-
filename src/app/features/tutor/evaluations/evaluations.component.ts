import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { Evaluation } from '../../../core/models';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-evaluations',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe],
  template: `
    <div class="evaluations-container">
      <div class="header">
        <div>
          <h1>📋 Historial de Evaluaciones</h1>
          <p>Todas las evaluaciones realizadas</p>
        </div>
        <a routerLink="/tutor/my-students" class="btn btn-primary">
          ➕ Nueva Evaluación
        </a>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filter-tabs">
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'all'"
            (click)="filterEvaluations('all')"
          >
            Todas ({{ evaluations.length }})
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'vinculation'"
            (click)="filterEvaluations('vinculation')"
          >
            Vinculación
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'dual'"
            (click)="filterEvaluations('dual')"
          >
            Prácticas Dual
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedFilter === 'prepro'"
            (click)="filterEvaluations('prepro')"
          >
            Preprofesionales
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando evaluaciones...</p>
      </div>

      <!-- Lista de Evaluaciones -->
      <div class="evaluations-list" *ngIf="!loading && filteredEvaluations.length > 0">
        <div class="evaluation-card" *ngFor="let evaluation of filteredEvaluations">
          <div class="eval-header">
            <div class="student-info">
              <div class="student-avatar">
                {{ getInitials(evaluation.student.person?.name, evaluation.student.person?.lastname) }}
              </div>
              <div class="student-details">
                <h3>{{ evaluation.student.person?.name }} {{ evaluation.student.person?.lastname }}</h3>
                <p class="student-email">{{ evaluation.student.email }}</p>
              </div>
            </div>
            <div class="eval-meta">
              <span class="eval-date">
                📅 {{ evaluation.evaluationDate | dateFormat }}
              </span>
              <span 
                class="subject-badge"
                [class.vinculation]="evaluation.subjectType === 'VINCULATION'"
                [class.dual]="evaluation.subjectType === 'DUAL_INTERNSHIP'"
                [class.prepro]="evaluation.subjectType === 'PREPROFESSIONAL_INTERNSHIP'"
              >
                {{ getSubjectTypeLabel(evaluation.subjectType) }}
              </span>
            </div>
          </div>

          <div class="eval-body">
            <div class="eval-info-grid">
              <div class="info-item">
                <span class="label">Plantilla:</span>
                <span class="value">{{ evaluation.template.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">Estado:</span>
                <span class="status-badge" [class.active]="evaluation.status === 'Aprobado'">
                  {{ evaluation.status }}
                </span>
              </div>
              <div class="info-item" *ngIf="evaluation.score">
                <span class="label">Calificación:</span>
                <span class="score-value">{{ evaluation.score }}/10</span>
              </div>
            </div>

            <div class="eval-comments" *ngIf="evaluation.comments">
              <h4>💬 Comentarios:</h4>
              <p>{{ evaluation.comments }}</p>
            </div>
          </div>

          <div class="eval-actions">
            <a 
              [routerLink]="['/tutor/evaluate', evaluation.student.id]" 
              class="btn btn-sm btn-outline"
            >
              👁️ Ver Detalle
            </a>
            <button class="btn btn-sm btn-outline" (click)="downloadEvaluation(evaluation.id)">
              📥 Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div class="empty-state" *ngIf="!loading && filteredEvaluations.length === 0">
        <div class="empty-icon">📋</div>
        <h3>{{ selectedFilter === 'all' ? 'No hay evaluaciones' : 'No hay evaluaciones de este tipo' }}</h3>
        <p>{{ selectedFilter === 'all' ? 'Aún no has realizado evaluaciones' : 'Cambia el filtro para ver otras evaluaciones' }}</p>
        <a routerLink="/tutor/my-students" class="btn btn-primary">
          Evaluar Estudiantes
        </a>
      </div>

      <!-- Error -->
      <div class="error-message" *ngIf="errorMessage">
        <span>⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .evaluations-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
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
    }

    .filters-card {
      background: white;
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .filter-tabs {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .tab-btn {
          padding: 10px 20px;
          border: 1.5px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s;

          &:hover {
            background: #fef3c7;
            border-color: #f59e0b;
          }

          &.active {
            background: #f59e0b;
            color: white;
            border-color: #f59e0b;
          }
        }
      }
    }

    .evaluations-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .evaluation-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
      }

      .eval-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        border-bottom: 2px solid #f3f4f6;
        gap: 20px;

        .student-info {
          display: flex;
          gap: 16px;
          align-items: center;
          flex: 1;

          .student-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 18px;
            flex-shrink: 0;
          }

          .student-details {
            h3 {
              font-size: 18px;
              color: #1f2937;
              font-weight: 600;
              margin-bottom: 4px;
            }

            .student-email {
              font-size: 13px;
              color: #6b7280;
              margin: 0;
            }
          }
        }

        .eval-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;

          .eval-date {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
          }

          .subject-badge {
            padding: 6px 12px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;

            &.vinculation {
              background: #fef3c7;
              color: #92400e;
            }

            &.dual {
              background: #dbeafe;
              color: #1e40af;
            }

            &.prepro {
              background: #d1fae5;
              color: #065f46;
            }
          }
        }
      }

      .eval-body {
        padding: 24px;

        .eval-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;

          .info-item {
            display: flex;
            flex-direction: column;
            gap: 6px;

            .label {
              font-size: 12px;
              color: #6b7280;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .value {
              font-size: 15px;
              color: #1f2937;
              font-weight: 600;
            }

            .status-badge {
              display: inline-block;
              width: fit-content;
              padding: 6px 12px;
              background: #fee2e2;
              color: #991b1b;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 600;

              &.active {
                background: #d1fae5;
                color: #065f46;
              }
            }

            .score-value {
              font-size: 24px;
              color: #f59e0b;
              font-weight: 700;
            }
          }
        }

        .eval-comments {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border-left: 3px solid #f59e0b;

          h4 {
            font-size: 14px;
            color: #1f2937;
            font-weight: 600;
            margin-bottom: 8px;
          }

          p {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
            margin: 0;
          }
        }
      }

      .eval-actions {
        padding: 16px 24px;
        background: #f9fafb;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
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
        border-top-color: #f59e0b;
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
      .header {
        flex-direction: column;

        .btn {
          width: 100%;
        }
      }

      .eval-header {
        flex-direction: column;
        align-items: flex-start !important;

        .eval-meta {
          align-items: flex-start !important;
        }
      }

      .eval-info-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class EvaluationsComponent implements OnInit {
  private evaluationService = inject(EvaluationService);

  evaluations: Evaluation[] = [];
  filteredEvaluations: Evaluation[] = [];
  loading = true;
  errorMessage = '';
  selectedFilter = 'all';

  ngOnInit(): void {
    this.loadEvaluations();
  }

  private loadEvaluations(): void {
    this.loading = true;
    this.evaluationService.getByTutor().subscribe({
      next: (evaluations) => {
        this.evaluations = evaluations;
        this.filteredEvaluations = evaluations;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las evaluaciones';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  filterEvaluations(filter: string): void {
    this.selectedFilter = filter;
    
    if (filter === 'all') {
      this.filteredEvaluations = this.evaluations;
    } else {
      const typeMap: { [key: string]: string } = {
        'vinculation': 'VINCULATION',
        'dual': 'DUAL_INTERNSHIP',
        'prepro': 'PREPROFESSIONAL_INTERNSHIP'
      };
      
      this.filteredEvaluations = this.evaluations.filter(
        e => e.subjectType === typeMap[filter]
      );
    }
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'E';
  }

  getSubjectTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación',
      'DUAL_INTERNSHIP': 'Prácticas Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Preprofesionales'
    };
    return labels[type] || type;
  }

  downloadEvaluation(id: number): void {
    // TODO: Implementar descarga de evaluación
    console.log('Downloading evaluation:', id);
    alert('Función de descarga en desarrollo');
  }
}