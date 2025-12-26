import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DocumentService } from '../../../../core/services/document.service';

@Component({
  selector: 'app-internship-preprofessional',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="internship-container">

      <!-- HEADER -->
      <div class="header">
        <div class="header-content">
          <span class="material-icons header-icon">work</span>
          <div>
            <h1>Prácticas Preprofesionales</h1>
            <p>Prácticas complementarias para fortalecer tu perfil profesional</p>
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
          Las prácticas preprofesionales son complementarias y te permiten aplicar
          conocimientos en un entorno real de trabajo.
        </p>

        <div class="info-grid">
          <div class="info-item">
            <span class="label">Estado</span>
            <span class="badge active">En curso</span>
          </div>
          <div class="info-item">
            <span class="label">Tipo</span>
            <span class="value">Complementarias</span>
          </div>
          <div class="info-item">
            <span class="label">Modalidad</span>
            <span class="value">Presencial / Virtual</span>
          </div>
        </div>
      </div>

      <!-- EMPRESA -->
      <div class="enterprise-section" *ngIf="hasEnterprise">
        <h2>
          <span class="material-icons">apartment</span>
          Mi Empresa de Prácticas
        </h2>

        <div class="enterprise-card">
          <span class="material-icons enterprise-icon">business</span>

          <div class="enterprise-info">
            <h3>{{ enterpriseName }}</h3>
            <div class="enterprise-details">
              <span>
                <span class="material-icons">location_on</span>
                {{ enterpriseAddress }}
              </span>
              <span>
                <span class="material-icons">person</span>
                Tutor: {{ tutorName }}
              </span>
              <span>
                <span class="material-icons">email</span>
                {{ tutorEmail }}
              </span>
            </div>
          </div>

          <span class="status-badge active">Activo</span>
        </div>
      </div>

      <!-- DOCUMENTOS -->
      <div class="documents-section">
        <h2>
          <span class="material-icons">description</span>
          Documentos Requeridos
        </h2>

        <div class="documents-grid">

          <!-- CARTA -->
          <div class="document-card">
            <div class="doc-header">
              <span class="material-icons doc-icon">assignment</span>
              <span class="doc-status pending">Pendiente</span>
            </div>

            <div class="doc-info">
              <h3>Carta de Presentación</h3>
              <p>Documento oficial de presentación ante la empresa</p>
              <div class="doc-meta">
                <span class="meta-item">PDF</span>
                <span class="meta-item">Vence en 15 días</span>
              </div>
            </div>

            <button class="btn btn-primary btn-sm" (click)="generateDocument('carta')">
              Generar documento
            </button>
          </div>

          <!-- PLAN -->
          <div class="document-card">
            <div class="doc-header">
              <span class="material-icons doc-icon">edit_document</span>
              <span class="doc-status in-progress">En proceso</span>
            </div>

            <div class="doc-info">
              <h3>Plan de Actividades</h3>
              <p>Cronograma de actividades a desarrollar</p>
              <div class="doc-meta">
                <span class="meta-item">Word / PDF</span>
                <span class="meta-item">Aprobación tutor</span>
              </div>
            </div>

            <button class="btn btn-primary btn-sm" (click)="uploadDocument('plan')">
              Subir documento
            </button>
          </div>

          <!-- INFORME FINAL -->
          <div class="document-card disabled">
            <div class="doc-header">
              <span class="material-icons doc-icon">task_alt</span>
              <span class="doc-status pending">Pendiente</span>
            </div>

            <div class="doc-info">
              <h3>Informe Final</h3>
              <p>Documento de cierre con evaluación y resultados</p>
              <div class="doc-meta">
                <span class="meta-item">PDF</span>
                <span class="meta-item">Al finalizar</span>
              </div>
            </div>

            <button class="btn btn-outline btn-sm" disabled>
              Bloqueado
            </button>
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
          <div class="progress-fill" [style.width.%]="progressPercentage"></div>
        </div>

        <p class="progress-text">
          {{ completedDocs }}/{{ totalDocs }} documentos completados
        </p>
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

/* ================= INFO ================= */
.info-card {
  background: #f8fafc;
  border: 1.5px solid #2563eb;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 32px;
}

.info-card h2 {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #0f172a;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.info-card p {
  color: #334155;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.label {
  color: #475569;
  font-weight: 500;
}

.value {
  color: #0f172a;
  font-weight: 600;
}

.badge.active {
  padding: 6px 14px;
  background: rgba(37,99,235,0.15);
  color: #2563eb;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* ================= EMPRESA ================= */
.enterprise-section {
  background: white;
  border-radius: 14px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.enterprise-card {
  display: flex;
  gap: 20px;
  align-items: center;
}

.enterprise-icon {
  font-size: 48px;
  color: #2563eb;
}

.enterprise-details span {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 14px;
  color: #64748b;
}

.status-badge.active {
  background: rgba(37,99,235,0.15);
  color: #2563eb;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
}

/* ================= DOCUMENTOS ================= */
.documents-section {
  background: white;
  border-radius: 14px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  margin-bottom: 32px;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.document-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.document-card.disabled {
  opacity: 0.6;
}

.doc-icon {
  font-size: 36px;
  color: #2563eb;
}

/* ================= PROGRESO ================= */
.progress-section {
  background: white;
  border-radius: 14px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.progress-bar {
  height: 22px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
}

.progress-text {
  text-align: center;
  margin-top: 8px;
  color: #64748b;
}
  `]
})
export class InternshipPreprofessionalComponent implements OnInit {
  private documentService = inject(DocumentService);

  hasEnterprise = true;

  enterpriseName = 'Tech Solutions S.A.';
  enterpriseAddress = 'Av. Principal 123, Quito';
  tutorName = 'Ing. María González';
  tutorEmail = 'maria.gonzalez@techsolutions.com';

  completedDocs = 1;
  totalDocs = 6;

  ngOnInit(): void {}

  get progressPercentage(): number {
    return Math.round((this.completedDocs / this.totalDocs) * 100);
  }

  generateDocument(type: string): void {
    console.log('Generar:', type);
  }

  uploadDocument(type: string): void {
    console.log('Subir:', type);
  }
}
