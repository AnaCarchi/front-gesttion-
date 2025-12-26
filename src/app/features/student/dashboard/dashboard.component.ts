import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface StudentStats {
  studentName: string;
  studentId: string;
  careerName: string;
  internshipType: string;
  totalHours: number;
  completedHours: number;
  progress: number;
  documentsUploaded: number;
  documentsRequired: number;
  tutor: string;
  company: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <!-- HEADER -->
      <div class="dashboard-header">
        <div class="header-content">
          <span class="material-icons header-icon">account_circle</span>
          <div>
            <h1>Panel del Estudiante</h1>
            <p>{{ stats.studentName }} - {{ stats.studentId }}</p>
          </div>
        </div>
      </div>

      <!-- WELCOME CARD -->
      <div class="welcome-card">
        <div class="welcome-left">
          <div class="welcome-icon">
            <span class="material-icons">emoji_events</span>
          </div>
          <div class="welcome-content">
            <h2>¡Bienvenido, {{ stats.studentName.split(' ')[0] }}!</h2>
            <p>Sigue tu progreso y completa tus actividades</p>
          </div>
        </div>
        <div class="progress-circle">
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8"/>
            <circle 
              cx="50" cy="50" r="45" fill="none" 
              stroke="#10b981" stroke-width="8"
              [attr.stroke-dasharray]="(283 * stats.progress / 100) + ' 283'"
              transform="rotate(-90 50 50)"
              stroke-linecap="round"
            />
          </svg>
          <div class="progress-text">{{ stats.progress }}%</div>
        </div>
      </div>

      <!-- INFO CARDS -->
      <div class="info-grid">
        <div class="info-card">
          <span class="material-icons info-icon">school</span>
          <div class="info-content">
            <div class="info-label">Carrera</div>
            <div class="info-value">{{ stats.careerName }}</div>
          </div>
        </div>

        <div class="info-card">
          <span class="material-icons info-icon">work</span>
          <div class="info-content">
            <div class="info-label">Tipo de Práctica</div>
            <div class="info-value">{{ getInternshipTypeLabel(stats.internshipType) }}</div>
          </div>
        </div>

        <div class="info-card">
          <span class="material-icons info-icon">corporate_fare</span>
          <div class="info-content">
            <div class="info-label">Empresa</div>
            <div class="info-value">{{ stats.company }}</div>
          </div>
        </div>

        <div class="info-card">
          <span class="material-icons info-icon">person</span>
          <div class="info-content">
            <div class="info-label">Tutor Empresarial</div>
            <div class="info-value">{{ stats.tutor }}</div>
          </div>
        </div>
      </div>

      <!-- STATS CARDS -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">
            <span class="material-icons">schedule</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Horas Completadas</div>
            <div class="stat-value">{{ stats.completedHours }}/{{ stats.totalHours }}</div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="stats.progress"></div>
            </div>
          </div>
        </div>

        <div class="stat-card success">
          <div class="stat-icon">
            <span class="material-icons">description</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Documentos</div>
            <div class="stat-value">{{ stats.documentsUploaded }}/{{ stats.documentsRequired }}</div>
            <div class="stat-sublabel">
              {{ stats.documentsRequired - stats.documentsUploaded }} pendientes
            </div>
          </div>
        </div>

        <div class="stat-card warning">
          <div class="stat-icon">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="stat-content">
            <div class="stat-label">Progreso General</div>
            <div class="stat-value">{{ stats.progress }}%</div>
            <div class="stat-sublabel">En desarrollo</div>
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
          <a [routerLink]="getSubjectsRoute()" class="action-btn">
            <span class="material-icons action-icon">menu_book</span>
            <span class="action-text">Mis Asignaturas</span>
          </a>
          <a routerLink="/student/documents" class="action-btn">
            <span class="material-icons action-icon">cloud_upload</span>
            <span class="action-text">Subir Documentos</span>
            <span class="badge" *ngIf="stats.documentsRequired - stats.documentsUploaded > 0">
              {{ stats.documentsRequired - stats.documentsUploaded }}
            </span>
          </a>
          <a routerLink="/student/progress" class="action-btn">
            <span class="material-icons action-icon">show_chart</span>
            <span class="action-text">Ver Progreso</span>
          </a>
          <a routerLink="/student/help" class="action-btn">
            <span class="material-icons action-icon">help</span>
            <span class="action-text">Ayuda</span>
          </a>
        </div>
      </div>

      <!-- PENDING TASKS -->
      <div class="tasks-section">
        <div class="section-header">
          <h2>
            <span class="material-icons">task_alt</span>
            Tareas Pendientes
          </h2>
        </div>
        <div class="tasks-list">
          <div class="task-item" *ngIf="stats.documentsRequired - stats.documentsUploaded > 0">
            <div class="task-icon pending">
              <span class="material-icons">upload_file</span>
            </div>
            <div class="task-content">
              <div class="task-title">Subir documentos pendientes</div>
              <div class="task-description">
                {{ stats.documentsRequired - stats.documentsUploaded }} documentos por cargar
              </div>
            </div>
            <a routerLink="/student/documents" class="task-action">
              <span class="material-icons">arrow_forward</span>
            </a>
          </div>

          <div class="task-item">
            <div class="task-icon progress">
              <span class="material-icons">schedule</span>
            </div>
            <div class="task-content">
              <div class="task-title">Completar horas requeridas</div>
              <div class="task-description">
                {{ stats.totalHours - stats.completedHours }} horas restantes
              </div>
            </div>
            <a [routerLink]="getSubjectsRoute()" class="task-action">
              <span class="material-icons">arrow_forward</span>
            </a>
          </div>

          <div class="task-item">
            <div class="task-icon completed">
              <span class="material-icons">check_circle</span>
            </div>
            <div class="task-content">
              <div class="task-title">Asignación de tutor</div>
              <div class="task-description">Completado - {{ stats.tutor }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- HELP SECTION -->
      <div class="help-section">
        <div class="section-header">
          <h2>
            <span class="material-icons">info</span>
            Información Importante
          </h2>
        </div>
        <div class="help-grid">
          <div class="help-card">
            <span class="material-icons help-icon">contact_support</span>
            <h3>¿Necesitas ayuda?</h3>
            <p>Contacta a tu coordinador para resolver dudas</p>
            <a href="mailto:coordinacion@yavirac.edu.ec" class="help-link">
              Enviar correo
              <span class="material-icons">email</span>
            </a>
          </div>

          <div class="help-card">
            <span class="material-icons help-icon">calendar_month</span>
            <h3>Fechas importantes</h3>
            <p>Revisa el calendario académico</p>
            <a routerLink="/student/calendar" class="help-link">
              Ver calendario
              <span class="material-icons">event</span>
            </a>
          </div>

          <div class="help-card">
            <span class="material-icons help-icon">book</span>
            <h3>Guías y recursos</h3>
            <p>Descarga material de apoyo</p>
            <a routerLink="/student/resources" class="help-link">
              Ver recursos
              <span class="material-icons">download</span>
            </a>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando tu información...</p>
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
  color: #10b981;
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
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
}

.welcome-left {
  display: flex;
  align-items: center;
  gap: 24px;
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
  color: #d1fae5;
  margin: 0;
}

.progress-circle {
  position: relative;
  width: 100px;
  height: 100px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  font-weight: 800;
  color: white;
}

/* ================= INFO GRID ================= */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 36px;
}

.info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.info-icon {
  font-size: 40px;
  color: #10b981;
  flex-shrink: 0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.info-value {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

/* ================= STATS ================= */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

.stat-card.primary { border-left: 5px solid #3b82f6; }
.stat-card.success { border-left: 5px solid #10b981; }
.stat-card.warning { border-left: 5px solid #f59e0b; }

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981, #059669);
  flex-shrink: 0;
}

.stat-icon .material-icons {
  font-size: 36px;
  color: white;
}

.stat-card.primary .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-sublabel {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.3s;
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
  border-color: #10b981;
  background: #d1fae5;
  transform: translateY(-6px);
}

.action-icon {
  font-size: 32px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
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

/* ================= TASKS ================= */
.tasks-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 26px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  margin-bottom: 44px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 14px;
  background: #f8fafc;
  transition: all 0.3s;
}

.task-item:hover {
  background: #f1f5f9;
  transform: translateX(8px);
}

.task-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.task-icon.pending {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.task-icon.progress {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.task-icon.completed {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.task-icon .material-icons {
  font-size: 24px;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.task-description {
  font-size: 13px;
  color: #64748b;
}

.task-action {
  color: #10b981;
  text-decoration: none;
}

.task-action .material-icons {
  font-size: 24px;
}

/* ================= HELP SECTION ================= */
.help-section {
  margin-bottom: 44px;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.help-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(6px);
  border-radius: 18px;
  padding: 26px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.help-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.help-icon {
  font-size: 56px;
  color: #10b981;
  margin-bottom: 16px;
}

.help-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.help-card p {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 16px;
}

.help-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-weight: 700;
  text-decoration: none;
  font-size: 14px;
}

.help-link:hover {
  text-decoration: underline;
}

.help-link .material-icons {
  font-size: 18px;
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
  .info-grid,
  .help-grid {
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
  
  .welcome-left {
    flex-direction: column;
  }
}
`]
})
export class StudentDashboardComponent implements OnInit {
  loading = true;
  stats: StudentStats = {
    studentName: 'Juan Carlos Pérez López',
    studentId: '2021-1234',
    careerName: 'Desarrollo de Software',
    internshipType: 'VINCULATION',
    totalHours: 160,
    completedHours: 92,
    progress: 58,
    documentsUploaded: 3,
    documentsRequired: 5,
    tutor: 'Ing. María González',
    company: 'Tech Solutions Cia. Ltda.'
  };

  ngOnInit(): void {
    this.loadStudentData();
  }

  private loadStudentData(): void {
    this.loading = true;

    // Simulated data - Replace with actual API calls
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  getInternshipTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'VINCULATION': 'Vinculación (160h)',
      'DUAL_INTERNSHIP': 'Prácticas Dual',
      'PREPROFESSIONAL_INTERNSHIP': 'Prácticas Preprofesionales'
    };
    return labels[type] || type;
  }

  getSubjectsRoute(): string {
    const routes: { [key: string]: string } = {
      'VINCULATION': '/student/subjects/vinculation',
      'DUAL_INTERNSHIP': '/student/subjects/dual',
      'PREPROFESSIONAL_INTERNSHIP': '/student/subjects/preprofessional'
    };
    return routes[this.stats.internshipType] || '/student/subjects';
  }
}