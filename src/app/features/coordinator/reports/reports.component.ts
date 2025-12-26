import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-dashboard">
      
      <!-- HEADER -->
      <div class="dashboard-header">
        <div class="header-content">
          <span class="material-icons header-icon">assessment</span>
          <div>
            <h1>Generación de Reportes</h1>
            <p>Exporta información académica y administrativa</p>
          </div>
        </div>
      </div>

      <!-- REPORTES -->
      <div class="reports-grid">
        <div class="report-card" *ngFor="let report of reportTypes">
          
          <div class="report-icon">
            <span class="material-icons">{{ report.icon }}</span>
          </div>

          <h3>{{ report.title }}</h3>
          <p>{{ report.description }}</p>

          <button class="btn-generate" (click)="generateReport(report.type)">
            <span class="material-icons">download</span>
            Generar Reporte
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
/* ================= CONTENEDOR GENERAL ================= */
.reports-dashboard {
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
  margin-bottom: 40px;
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
  margin-bottom: 6px;
}

.dashboard-header p {
  font-size: 15px;
  color: #e5e7eb;
  margin: 0;
}

/* ================= GRID ================= */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* ================= CARD ================= */
.report-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 32px 26px;
  text-align: center;
  box-shadow: 0 15px 30px rgba(0,0,0,0.25);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.report-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 45px rgba(0,0,0,0.35);
}

/* ================= ICONO ================= */
.report-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: linear-gradient(135deg, #2563eb, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.report-icon .material-icons {
  font-size: 38px;
  color: #ffffff;
}

/* ================= TEXTO ================= */
.report-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.report-card p {
  font-size: 14px;
  color: #475569;
  margin-bottom: 26px;
}

/* ================= BOTÓN ================= */
.btn-generate {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 12px 20px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-generate .material-icons {
  font-size: 20px;
}

.btn-generate:hover {
  background: linear-gradient(135deg, #f97316, #ea580c);
  transform: translateY(-2px);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .reports-dashboard {
    padding: 24px 16px;
  }
}
  `]
})
export class ReportsComponent {

  reportTypes = [
    {
      type: 'students',
      icon: 'groups',
      title: 'Reporte de Estudiantes',
      description: 'Listado completo de estudiantes con información académica'
    },
    {
      type: 'vinculation',
      icon: 'handshake',
      title: 'Vinculación',
      description: 'Reporte de estudiantes en programas de vinculación'
    },
    {
      type: 'internships',
      icon: 'work',
      title: 'Prácticas',
      description: 'Reporte de estudiantes en prácticas preprofesionales'
    }
  ];

  generateReport(type: string): void {
    console.log('Generando reporte:', type);
    alert(`Generando reporte: ${type}`);
  }
}
