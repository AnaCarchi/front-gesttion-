import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private documentsKey = 'documents';

  constructor() {
    if (!localStorage.getItem(this.documentsKey)) {
      localStorage.setItem(this.documentsKey, JSON.stringify([]));
    }
  }

  // ================= GENERAR DOCUMENTO =================
  generateDocument(templateName: string, data: any): Observable<Blob> {
    const content = `
      DOCUMENTO GENERADO
      Plantilla: ${templateName}
      Fecha: ${new Date().toLocaleString()}
      Datos:
      ${JSON.stringify(data, null, 2)}
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    return of(blob);
  }

  // ================= SUBIR DOCUMENTO (SIMULADO) =================
  uploadDocument(file: File, metadata: any): Observable<any> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = () => {
        const documents = this.read();
        const document = {
          id: Date.now(),
          name: file.name,
          type: file.type,
          size: file.size,
          metadata,
          content: reader.result, // base64
          createdAt: new Date()
        };

        documents.push(document);
        this.save(documents);

        observer.next({
          success: true,
          message: 'Documento cargado correctamente',
          document
        });
        observer.complete();
      };

      reader.readAsDataURL(file);
    });
  }

  // ================= DESCARGAR DOCUMENTO =================
  downloadDocument(documentId: number): Observable<Blob> {
    const documents = this.read();
    const doc = documents.find((d: any) => d.id === documentId);

    if (!doc) {
      return of(new Blob());
    }

    const base64 = doc.content.split(',')[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.type });

    return of(blob);
  }

  // ================= UTILIDADES =================
  private read(): any[] {
    return JSON.parse(localStorage.getItem(this.documentsKey) || '[]');
  }

  private save(data: any[]): void {
    localStorage.setItem(this.documentsKey, JSON.stringify(data));
  }
}
