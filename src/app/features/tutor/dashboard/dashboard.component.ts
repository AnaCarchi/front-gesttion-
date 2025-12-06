import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { EvaluationService } from '../../../core/services/evaluation.service';
import { Student, Evaluation } from '../../../core/models';

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="tutor-dashboard">
      <div class="dashboard-header">
        <div>
          <h1>👔 Dashboard del Tutor</h1>
          <p>Gestión de estudiantes y evaluaciones</p>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-label">Mis Estudiantes</div>
            <div class="stat-value">{{ students.length }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-label">Evaluados</div>
            <div class="stat-value">{{ evaluatedCount }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-label">Pendientes</div>
            <div class="stat-value">{{ students.length - evaluatedCount }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-label">Total Evaluaciones</div>
            <div class="stat-value">{{ evaluations.length }}</div>
          </div>
        </div>
      </div>

      <!-- Estudiantes Asignados -->
      <div class="section-card">
        <div class="section-header">
          <h2>👥 Mis Estudiantes</h2>
          <a routerLink="/tutor/my-students" class="btn btn-outline btn-sm">
            Ver Todos →
          </a>
        </div>

        <div class="students-grid" *ngIf="students.length > 0">
          <div class="student-card" *ngFor="let student of students.slice(0, 4)">
            <div class="student-header">
              <div class="student-avatar">
                {{ getInitials(student.person?.name, student.person?.lastname) }}
              </div>
              <div class="student-info">
                <div class="student-name">
                  {{ student.person?.name }} {{ student.person?.lastname }}
                </div>
                <div class="student-email">{{ student.email }}</div>
              </div>
            </div>
            
            <div class="student-subjects">
              <span 
                *ngFor="let subject of student.enrolledSubjects" 
                class="subject-badge"
              >
                {{ getSubjectLabel(subject.type) }}
              </span>
            </div>

            <a 
              [routerLink]="['/tutor/evaluate', student.id]" 
              class="btn btn-primary btn-sm btn-block"
            >
              📝 Evaluar
            </a>
          </div>
        </div>

        <div class="empty-state" *ngIf="students.length === 0">
          <p>No tienes estudiantes asignados</p>
        </div>
      </div>

      <!-- Evaluaciones Recientes -->
      <div class="section-card">
        <div class="section-header">
          <h2>📋 Evaluaciones Recientes</h2>
          <a routerLink="/tutor/evaluations" class="btn btn-outline btn-sm">
            Ver Todas →
          </a>
        </div>

        <div class="evaluations-list" *ngIf="evaluations.length > 0">
          <div class="evaluation-item" *ngFor="let eval of evaluations.slice(0, 5)">
            <div class="eval-icon">📝</div>
            <div class="eval-content">
              <div class="eval-student">
                {{ eval.student.person?.name }} {{ eval.student.person?.lastname }}
              </div>
              <div class="eval-date">{{ eval.evaluationDate | date:'dd/MM/yyyy' }}</div>
            </div>
            <div class="eval-score" *ngIf="eval.score">
              <span class="score-value">{{ eval.score }}/10</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="evaluations.length === 0">
          <p>No hay evaluaciones registradas</p>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos similares al coordinator-dashboard */
    .tutor-dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;

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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      gap: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .stat-icon {
        font-size: 40px;
      }

      .stat-content {
        .stat-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 700;
          color: #1f2937;
        }
      }
    }

    .section-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 2px solid #f3f4f6;

        h2 {
          font-size: 20px;
          color: #1f2937;
          font-weight: 600;
        }
      }
    }

    .students-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .student-card {
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s;

      &:hover {
        border-color: #f59e0b;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
      }

      .student-header {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        .student-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .student-info {
          flex: 1;

          .student-name {
            font-size: 15px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
          }

          .student-email {
            font-size: 12px;
            color: #6b7280;
          }
        }
      }

      .student-subjects {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 16px;

        .subject-badge {
          padding: 4px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
        }
      }
    }

    .evaluations-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .evaluation-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;

      .eval-icon {
        font-size: 24px;
      }

      .eval-content {
        flex: 1;

        .eval-student {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .eval-date {
          font-size: 12px;
          color: #6b7280;
        }
      }

      .eval-score {
        .score-value {
          padding: 6px 12px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #6b7280;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px;

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #f59e0b;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 16px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class TutorDashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private evaluationService = inject(EvaluationService);

  students: Student[] = [];
  evaluations: Evaluation[] = [];
  loading = true;
  evaluatedCount = 0;

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading = true;

    this.studentService.getMyStudents().subscribe({
      next: (students) => {
        this.students = students;
      }
    });

    this.evaluationService.getByTutor().subscribe({
      next: (evaluations) => {
        this.evaluations = evaluations;
        this.evaluatedCount = new Set(evaluations.map(e => e.student.id)).size;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getSubjectLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación',
      'DUAL_INTERNSHIP': 'Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Preprofesional'
    };
    return labels[type] || type;
  }
}