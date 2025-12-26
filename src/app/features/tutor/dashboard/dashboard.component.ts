import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';

interface TutorStats {
  totalStudents: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageProgress: number;
  companyName: string;
}

@Component({
  selector: 'app-tutor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">

      <!-- HEADER -->
      <div class="dashboard-header">
        <div class="header-content">
          <span class="material-icons header-icon">corporate_fare</span>
          <div>
            <h1>Panel del Tutor Empresarial</h1>
            <p>{{ stats.companyName }}</p>
          </div>
        </div>
      </div>

      <!-- WELCOME -->
      <div class="welcome-card">
        <div class="welcome-icon">
          <span class="material-icons">waving_hand</span>
        </div>
        <div class="welcome-content">
          <h2>¡Bienvenido de nuevo!</h2>
          <p>Gestiona y evalúa a tus estudiantes asignados</p>
        </div>
      </div>

      <!-- STATS -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <span class="material-icons">supervised_user_circle</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Mis Estudiantes</div>
            <div class="stat-value">{{ stats.totalStudents }}</div>
            <div class="stat-sublabel">Asignados actualmente</div>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">
            <span class="material-icons">pending_actions</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Evaluaciones Pendientes</div>
            <div class="stat-value">{{ stats.pendingEvaluations }}</div>
            <div class="stat-sublabel">Por completar</div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">
            <span class="material-icons">task_alt</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Evaluaciones Completadas</div>
            <div class="stat-value">{{ stats.completedEvaluations }}</div>
            <div class="stat-sublabel">Este periodo</div>
          </div>
        </div>

        <div class="stat-card info">
          <div class="stat-icon">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Progreso Promedio</div>
            <div class="stat-value">{{ stats.averageProgress }}%</div>
            <div class="stat-sublabel">General</div>
          </div>
        </div>
      </div>

      <!-- QUICK ACTIONS -->
      <div class="quick-actions">
        <div class="section-header">
          <h2>
            <span class="material-icons">flash_on</span>
            Acciones Rápidas
          </h2>
        </div>

        <div class="actions-grid">
          <a routerLink="/tutor/my-students" class="action-btn">
            <span class="material-icons action-icon">group</span>
            <span class="action-text">Ver Estudiantes</span>
          </a>

          <a routerLink="/tutor/my-students" class="action-btn">
            <span class="material-icons action-icon">rate_review</span>
            <span class="action-text">Evaluar Estudiante</span>
            <span class="badge" *ngIf="stats.pendingEvaluations > 0">
              {{ stats.pendingEvaluations }}
            </span>
          </a>

          <a routerLink="/tutor/evaluations" class="action-btn">
            <span class="material-icons action-icon">fact_check</span>
            <span class="action-text">Historial</span>
          </a>
        </div>
      </div>

      <!-- ALERT -->
      <div class="alert-section" *ngIf="stats.pendingEvaluations > 0">
        <div class="alert-box warning">
          <span class="material-icons">warning</span>
          <div>
            <strong>{{ stats.pendingEvaluations }} evaluaciones pendientes</strong>
            <p>Hay evaluaciones que requieren tu atención</p>
          </div>
          <a routerLink="/tutor/my-students" class="alert-link">
            Evaluar ahora
            <span class="material-icons">arrow_forward</span>
          </a>
        </div>
      </div>

      <!-- LOADING -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando datos del tutor...</p>
      </div>

    </div>
  `,
    styles: [`
/* ================= CONTENEDOR ================= */
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* ================= HEADER ================= */
.dashboard-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 48px;
  color: #0ea5e9;
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

/* ================= WELCOME CARD ================= */
.welcome-card {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 36px;
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.3);
}

.welcome-icon .material-icons {
  font-size: 64px;
  color: #fef3c7;
}

.welcome-content h2 {
  font-size: 28px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
}

.welcome-content p {
  font-size: 16px;
  color: #e0f2fe;
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
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.35);
}

.stat-card.primary { border-left: 5px solid #0ea5e9; }
.stat-card.warning { border-left: 5px solid #f59e0b; }
.stat-card.success { border-left: 5px solid #10b981; }
.stat-card.info { border-left: 5px solid #8b5cf6; }

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  flex-shrink: 0;
}

.stat-icon .material-icons {
  font-size: 36px;
  color: white;
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-card.success .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stat-card.info .stat-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

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

/* ================= SECTION HEADERS ================= */
.section-header {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fbbf24;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
}

.view-all-link:hover {
  text-decoration: underline;
}

/* ================= QUICK ACTIONS ================= */
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
  position: relative;
}

.action-btn:hover {
  border-color: #0ea5e9;
  background: #e0f2fe;
  transform: translateY(-6px);
}

.action-icon {
  font-size: 32px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover .action-icon {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.action-text {
  text-align: center;
  font-size: 14px;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

/* ================= ALERT ================= */
.alert-section {
  margin-bottom: 44px;
}

.alert-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.alert-box.warning {
  border-left: 5px solid #f59e0b;
}

.alert-box .material-icons {
  font-size: 40px;
  color: #f59e0b;
}

.alert-box strong {
  color: #0f172a;
  display: block;
  margin-bottom: 4px;
}

.alert-box p {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.alert-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0ea5e9;
  font-weight: 700;
  text-decoration: none;
  margin-left: auto;
}

.alert-link:hover {
  text-decoration: underline;
}

/* ================= STUDENTS SECTION ================= */
.students-section {
  margin-bottom: 44px;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.student-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.student-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.student-avatar .material-icons {
  font-size: 32px;
  color: white;
}

.student-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.student-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.student-type .material-icons {
  font-size: 16px;
}

.student-progress {
  margin-top: 8px;
}

.progress-label {
  font-size: 12px;
  font-weight: 700;
  color: #0ea5e9;
  margin-bottom: 6px;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
  transition: width 0.3s;
}

/* ================= TIPS SECTION ================= */
.tips-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  margin-bottom: 44px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tip-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 14px;
  background: #f8fafc;
  transition: all 0.3s;
}

.tip-card:hover {
  background: #e0f2fe;
  transform: translateY(-4px);
}

.tip-icon {
  font-size: 40px;
  color: #0ea5e9;
  flex-shrink: 0;
}

.tip-content h3 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.tip-content p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
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
  to { transform: rotate(360deg); }
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .stats-grid,
  .actions-grid,
  .students-grid,
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .welcome-card {
    flex-direction: column;
    text-align: center;
  }
  
  .alert-box {
    flex-direction: column;
    text-align: center;
  }
  
  .alert-link {
    margin-left: 0;
  }
}
`]
})
export class TutorDashboardComponent implements OnInit {

  private studentService = inject(StudentService);

  loading = true;

  stats: TutorStats = {
    totalStudents: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageProgress: 0,
    companyName: 'Empresa ABC S.A.'
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Simulación (reemplazar por API real)
    setTimeout(() => {
      this.stats = {
        totalStudents: 12,
        pendingEvaluations: 3,
        completedEvaluations: 15,
        averageProgress: 68,
        companyName: 'Empresa ABC S.A.'
      };
      this.loading = false;
    }, 800);
  }
}

