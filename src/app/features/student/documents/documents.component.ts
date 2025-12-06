import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="documents-container">
      <div class="header">
        <h1>📄 Mis Documentos</h1>
        <p>Documentos generados y descargables</p>
      </div>

      <div class="documents-categories">
        <div class="category-section">
          <h2>🤝 Vinculación</h2>
          <div class="docs-list">
            <div class="doc-item">
              <div class="doc-info">
                <span class="doc-icon">📋</span>
                <span class="doc-name">Ficha de Registro - Vinculación.pdf</span>
              </div>
              <button class="btn btn-sm btn-primary">📥 Descargar</button>
            </div>
          </div>
        </div>

        <div class="category-section">
          <h2>🎓 Prácticas Duales</h2>
          <div class="docs-list">
            <div class="doc-item">
              <div class="doc-info">
                <span class="doc-icon">📝</span>
                <span class="doc-name">Plan de Trabajo.pdf</span>
              </div>
              <button class="btn btn-sm btn-primary">📥 Descargar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .documents-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;

      h1 {
        font-size: 32px;
        color: #1f2937;
        font-weight: 700;
        margin-bottom: 8px;
      }

      p {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }
    }

    .category-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 18px;
        color: #1f2937;
        margin-bottom: 16px;
        font-weight: 600;
      }

      .docs-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .doc-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.2s;

        &:hover {
          background: #f9fafb;
          border-color: #10b981;
        }

        .doc-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .doc-icon {
            font-size: 24px;
          }

          .doc-name {
            font-size: 14px;
            color: #1f2937;
            font-weight: 500;
          }
        }
      }
    }
  `]
})
export class DocumentsComponent {}