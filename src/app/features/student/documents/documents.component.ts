import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documents-container">

      <!-- HEADER -->
      <div class="header">
        <h1>Mis Documentos</h1>
        <p>Documentos generados y disponibles para descarga</p>
      </div>

      <!-- VINCULACIÓN -->
      <div class="category-section">
        <h2>
          <span class="material-icons">handshake</span>
          Vinculación
        </h2>

        <div class="docs-list">
          <div class="doc-item">
            <div class="doc-info">
              <span class="material-icons doc-icon">description</span>
              <span class="doc-name">Ficha de Registro - Vinculación.pdf</span>
            </div>
            <button class="btn btn-primary">
              <span class="material-icons">download</span>
              Descargar
            </button>
          </div>
        </div>
      </div>

      <!-- PRÁCTICAS -->
      <div class="category-section">
        <h2>
          <span class="material-icons">school</span>
          Prácticas Duales
        </h2>

        <div class="docs-list">
          <div class="doc-item">
            <div class="doc-info">
              <span class="material-icons doc-icon">description</span>
              <span class="doc-name">Plan de Trabajo.pdf</span>
            </div>
            <button class="btn btn-primary">
              <span class="material-icons">download</span>
              Descargar
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
/* ================= CONTENEDOR ================= */
.documents-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

/* ================= HEADER ================= */
.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 28px;
  color: #0f172a;
  font-weight: 700;
  margin-bottom: 6px;
}

.header p {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}

/* ================= SECCIÓN ================= */
.category-section {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.category-section h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 18px;
}

.category-section h2 .material-icons {
  color: #2563eb;
  font-size: 22px;
}

/* ================= LISTA ================= */
.docs-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ================= ITEM ================= */
.doc-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.25s ease;
}

.doc-item:hover {
  background: #f8fafc;
  border-color: #2563eb;
}

/* ================= INFO ================= */
.doc-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.doc-icon {
  font-size: 26px;
  color: #2563eb;
}

.doc-name {
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
}

/* ================= BOTÓN ================= */
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-primary {
  background: rgba(249,115,22,0.15);
  color: #f97316;
}

.btn-primary:hover {
  background: rgba(249,115,22,0.3);
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .documents-container {
    padding: 16px;
  }

  .doc-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
  `]
})
export class DocumentsComponent {}
