import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { CareerService } from '../../../core/services/career.service';
import { Student, Career } from '../../../core/models';

@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">

      <!-- HEADER -->
      <div class="dashboard-header">
        <div class="header-content">
          <span class="material-icons header-icon">dashboard</span>
          <div>
            <h1>Dashboard de Coordinación</h1>
            <p>Resumen general académico y administrativo</p>
          </div>
        </div>
      </div>

      <!-- STATS -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <span class="material-icons">groups</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Estudiantes</div>
            <div class="stat-value">{{ totalStudents }}</div>
            <div class="stat-sublabel">Registrados</div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Matriculados SIGA</div>
            <div class="stat-value">{{ matriculated }}</div>
            <div class="stat-sublabel">Con registro oficial</div>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">
            <span class="material-icons">person_pin</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Con Tutor</div>
            <div class="stat-value">{{ withTutor }}</div>
            <div class="stat-sublabel">Asignados</div>
          </div>
        </div>

        <a
          routerLink="/coordinator/students"
          class="stat-card action-card"
        >
          <div class="stat-icon">
            <span class="material-icons">arrow_forward</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Gestión</div>
            <div class="stat-value">Estudiantes</div>
            <div class="stat-link">
              Ir ahora
              <span class="material-icons">chevron_right</span>
            </div>
          </div>
        </a>
      </div>

      <!-- ACCIONES RÁPIDAS -->
      <div class="quick-actions">
        <div class="section-header">
          <h2>
            <span class="material-icons">bolt</span>
            Acciones rápidas
          </h2>
        </div>

        <div class="actions-grid">
          <a routerLink="/coordinator/students" class="action-btn">
            <div class="action-icon">
              <span class="material-icons">groups</span>
            </div>
            <div class="action-text">Gestionar estudiantes</div>
          </a>

          <a
            routerLink="/coordinator/students"
            [queryParams]="{ tutor: false }"
            class="action-btn"
          >
            <div class="action-icon">
              <span class="material-icons">search</span>
            </div>
            <div class="action-text">Estudiantes sin tutor</div>
          </a>

          <a routerLink="/coordinator/reports" class="action-btn">
            <div class="action-icon">
              <span class="material-icons">description</span>
            </div>
            <div class="action-text">Generar reportes</div>
          </a>
        </div>
      </div>

      <!-- ACTIVIDAD -->
      <div class="section-header">
        <h2>
          <span class="material-icons">history</span>
          Actividad reciente
        </h2>
      </div>

      <div class="recent-activity">
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">
              <span class="material-icons">person_add</span>
            </div>
            <div>
              <div class="activity-title">Nuevo estudiante registrado</div>
              <div class="activity-time">
                <span class="material-icons">schedule</span>
                Hace 2 horas
              </div>
            </div>
          </div>

          <div class="activity-item">
            <div class="activity-icon">
              <span class="material-icons">assignment</span>
            </div>
            <div>
              <div class="activity-title">Tutor asignado</div>
              <div class="activity-time">
                <span class="material-icons">schedule</span>
                Hoy
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>

    </div>
  `,
  styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background-image:
    linear-gradient(
      rgba(15, 23, 42, 0.75),
      rgba(15, 23, 42, 0.75)
    ),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* ================= HEADER ================= */
.dashboard-header {
  margin-bottom: 36px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 48px;
  color: #3b82f6;
}

.dashboard-header h1 {
  font-size: 34px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
}

.dashboard-header p {
  font-size: 15px;
  color: #e5e7eb;
  margin: 0;
}

/* ================= STATS ================= */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 44px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  display: flex;
  gap: 20px;
  align-items: center;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.35);
}

.stat-card.primary { border-left: 5px solid #3b82f6; }
.stat-card.success { border-left: 5px solid #10b981; }
.stat-card.warning { border-left: 5px solid #f59e0b; }

.stat-card.action-card {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  border-left: none;
}

/* ================= ICONOS ================= */
.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f97316, #ea580c);
  flex-shrink: 0;
}

.stat-icon .material-icons {
  font-size: 36px;
  color: #ffffff;
}

.stat-card.action-card .stat-icon {
  background: linear-gradient(135deg, #fbbf24, #f97316);
}

/* ================= TEXTO STATS ================= */
.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 38px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.stat-sublabel {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.stat-card.action-card .stat-label,
.stat-card.action-card .stat-value,
.stat-card.action-card .stat-sublabel {
  color: #ffffff;
}

/* ================= LINK ================= */
.stat-link {
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #ffffff;
  text-decoration: none;
}

.stat-link .material-icons {
  font-size: 18px;
}

.stat-link:hover {
  text-decoration: underline;
}

/* ================= SECTION HEADERS ================= */
.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
}

.section-header h2 .material-icons {
  font-size: 28px;
  color: #fbbf24;
}

/* ================= ACCIONES RÁPIDAS ================= */
.quick-actions {
  margin-bottom: 44px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 18px;
}

.action-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 24px;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #0f172a;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: #2563eb;
  background: #eff6ff;
  transform: translateY(-6px);
}

.action-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon .material-icons {
  font-size: 32px;
}

.action-btn:hover .action-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.action-text {
  text-align: center;
  font-size: 14px;
}

/* ================= ACTIVIDAD ================= */
.recent-activity {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 14px;
  transition: background 0.2s;
}

.activity-item:hover {
  background: #f1f5f9;
}

.activity-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon .material-icons {
  font-size: 24px;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
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
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }
}
  `]
})
export class CoordinatorDashboardComponent implements OnInit {

  private studentService = inject(StudentService);
  private careerService = inject(CareerService);

  students: Student[] = [];
  careers: Career[] = [];

  totalStudents = 0;
  matriculated = 0;
  withTutor = 0;

  loading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.studentService.getAll().subscribe(students => {
      this.students = students;
      this.totalStudents = students.length;
      this.matriculated = students.filter(s => s.isMatriculatedInSIGA).length;
      this.withTutor = students.filter(s => s.tutor).length;
      this.loading = false;
    });

    this.careerService.getByCoordinator().subscribe(c => {
      this.careers = c;
    });
  }
}
