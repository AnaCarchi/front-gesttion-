import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-internship-dual',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="internship-container">

      <!-- HEADER -->
      <div class="header">
        <div class="header-content">
          <span class="material-icons header-icon">school</span>
          <div>
            <h1>Prácticas de Formación Dual</h1>
            <p>Prácticas obligatorias curriculares</p>
          </div>
        </div>
      </div>

      <!-- INFORMACIÓN -->
      <div class="info-card">
        <h2>
          <span class="material-icons">info</span>
          Información de las Prácticas
        </h2>

        <p>
          Las prácticas de formación dual son obligatorias y forman parte integral
          de tu programa académico.
        </p>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Estado</span>
            <span class="badge active">En curso</span>
          </div>

          <div class="info-item">
            <span class="label">Tipo</span>
            <span class="value">Obligatorias / Curriculares</span>
          </div>
        </div>
      </div>

      <!-- DOCUMENTOS -->
      <div class="documents-section">
        <h2>
          <span class="material-icons">description</span>
          Documentos Requeridos
        </h2>

        <div class="documents-grid">
          <div class="document-card">
            <span class="material-icons doc-icon">assignment</span>
            <div class="doc-info">
              <h3>Ficha de Registro</h3>
              <p>Datos básicos del estudiante y empresa</p>
            </div>
            <button class="btn btn-primary btn-sm">Completar</button>
          </div>

          <div class="document-card">
            <span class="material-icons doc-icon">edit_document</span>
            <div class="doc-info">
              <h3>Plan de Trabajo</h3>
              <p>Actividades programadas</p>
            </div>
            <button class="btn btn-primary btn-sm">Subir</button>
          </div>

          <div class="document-card">
            <span class="material-icons doc-icon">bar_chart</span>
            <div class="doc-info">
              <h3>Informes de Progreso</h3>
              <p>Reportes mensuales</p>
            </div>
            <button class="btn btn-primary btn-sm">Generar</button>
          </div>

          <div class="document-card disabled">
            <span class="material-icons doc-icon">task_alt</span>
            <div class="doc-info">
              <h3>Informe Final</h3>
              <p>Documento de cierre</p>
            </div>
            <button class="btn btn-outline btn-sm" disabled>Pendiente</button>
          </div>
        </div>
      </div>

      <!-- PROGRESO -->
      <div class="progress-section">
        <h2>
          <span class="material-icons">trending_up</span>
          Progreso General
        </h2>

        <div class="progress-bar">
          <div class="progress-fill" style="width: 45%"></div>
        </div>

        <p class="progress-text">45% completado</p>
      </div>

    </div>
  `,
  styles: [`
/* ================= CONTENEDOR ================= */
.internship-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

/* ================= HEADER ================= */
.header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  font-size: 56px;
  color: #2563eb;
}

.header h1 {
  font-size: 28px;
  color: #0f172a;
  font-weight: 700;
  margin-bottom: 4px;
}

.header p {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

/* ================= INFO CARD ================= */
.info-card {
  background: #f8fafc;
  border: 1.5px solid #2563eb;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 32px;
}

.info-card h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 12px;
}

.info-card h2 .material-icons {
  color: #2563eb;
}

.info-card p {
  color: #334155;
  margin-bottom: 16px;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
}

.badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.badge.active {
  background: rgba(37,99,235,0.15);
  color: #2563eb;
}

/* ================= DOCUMENTOS ================= */
.documents-section {
  background: #ffffff;
  border-radius: 14px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.documents-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 24px;
}

.documents-section h2 .material-icons {
  color: #2563eb;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.document-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.25s ease;
}

.document-card:hover {
  border-color: #2563eb;
  background: #f8fafc;
}

.document-card.disabled {
  opacity: 0.6;
}

.doc-icon {
  font-size: 36px;
  color: #2563eb;
}

.doc-info h3 {
  font-size: 15px;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 4px;
}

.doc-info p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

/* ================= BOTONES ================= */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-sm {
  font-size: 13px;
}

.btn-primary {
  background: rgba(249,115,22,0.15);
  color: #f97316;
}

.btn-primary:hover {
  background: rgba(249,115,22,0.3);
}

.btn-outline {
  background: transparent;
  border: 1.5px dashed #cbd5f5;
  color: #64748b;
  cursor: not-allowed;
}

/* ================= PROGRESO ================= */
.progress-section {
  background: #ffffff;
  border-radius: 14px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.progress-section h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 20px;
}

.progress-section h2 .material-icons {
  color: #2563eb;
}

.progress-bar {
  height: 22px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin: 0;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .internship-container {
    padding: 16px;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class InternshipDualComponent {}
