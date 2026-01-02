import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Internship } from '../models';

export type InternshipStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  private internshipsKey = 'internships';

  constructor() {
    this.initMockData();
  }

  // ================= OBTENER TODOS =================
  getAll(): Observable<Internship[]> {
    return of(this.read());
  }

  // ================= OBTENER POR ID =================
  getById(id: number): Observable<Internship> {
    const internship = this.read().find((i: any) => i.id === id);
    return of(internship);
  }

  // ================= CREAR =================
  create(internship: Internship): Observable<Internship> {
    const internships = this.read();

    const newInternship: Internship = {
      ...internship,
      id: Date.now(),
      status: internship.status || 'PENDING'
    };

    internships.push(newInternship);
    this.save(internships);

    return of(newInternship);
  }

  // ================= ACTUALIZAR =================
  update(id: number, internship: Internship): Observable<Internship> {
    const internships = this.read();
    const index = internships.findIndex((i: any) => i.id === id);

    if (index !== -1) {
      internships[index] = { ...internships[index], ...internship };
      this.save(internships);
    }

    return of(internships[index]);
  }

  // ================= ACTUALIZAR ESTADO =================
  updateStatus(id: number, status: InternshipStatus): Observable<Internship> {
    const internships = this.read();
    const index = internships.findIndex((i: any) => i.id === id);

    if (index !== -1) {
      internships[index].status = status;
      this.save(internships);
    }

    return of(internships[index]);
  }

  // ================= ELIMINAR =================
  delete(id: number): Observable<void> {
    const internships = this.read().filter((i: any) => i.id !== id);
    this.save(internships);
    return of(void 0);
  }

  // ================= GENERAR DOCUMENTOS (SIMULADO) =================
  generateDocuments(id: number): Observable<Blob> {
    const internship = this.read().find((i: any) => i.id === id);

    const content = `
      DOCUMENTOS DE PRÁCTICAS
      Práctica ID: ${id}
      Estudiante: ${internship?.studentName || 'N/A'}
      Estado: ${internship?.status}
      Fecha: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([content], { type: 'application/pdf' });
    return of(blob);
  }

  // ================= UTILIDADES =================
  private read(): any[] {
    return JSON.parse(localStorage.getItem(this.internshipsKey) || '[]');
  }

  private save(data: any[]): void {
    localStorage.setItem(this.internshipsKey, JSON.stringify(data));
  }

  // ================= DATOS INICIALES =================
  private initMockData(): void {
    if (!localStorage.getItem(this.internshipsKey)) {
      this.save([
        {
          id: 1,
          studentName: 'Juan Pérez',
          companyName: 'Empresa Alpha',
          status: 'IN_PROGRESS'
        },
        {
          id: 2,
          studentName: 'Ana López',
          companyName: 'Empresa Beta',
          status: 'PENDING'
        }
      ]);
    }
  }
}
