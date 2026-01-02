import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Enterprise } from '../models';

export interface CompanyWithStudents extends Enterprise {
  studentCount: number;
  internshipTypes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private companiesKey = 'companies';
  private studentsKey = 'students';
  private evaluationsKey = 'evaluations';

  constructor() {
    this.initMockData();
  }

  // ================= EMPRESAS =================

  getMyCompanies(): Observable<CompanyWithStudents[]> {
    const companies = this.read(this.companiesKey);

    const result = companies.map((c: any) => ({
      ...c,
      studentCount: this.read(this.studentsKey).filter((s: any) => s.companyId === c.id).length,
      internshipTypes: c.internshipTypes || ['PREPROFESIONAL']
    }));

    return of(result);
  }

  getCompanyById(companyId: number): Observable<CompanyWithStudents> {
    const company = this.read(this.companiesKey)
      .find((c: any) => c.id === companyId);

    const students = this.read(this.studentsKey)
      .filter((s: any) => s.companyId === companyId);

    return of({
      ...company,
      studentCount: students.length,
      internshipTypes: company?.internshipTypes || []
    });
  }

  // ================= ESTUDIANTES =================

  getCompanyStudents(companyId: number, filters?: any): Observable<any[]> {
    let students = this.read(this.studentsKey)
      .filter((s: any) => s.companyId === companyId);

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          students = students.filter((s: any) => s[key] === filters[key]);
        }
      });
    }

    return of(students);
  }

  // ================= EVALUACIONES =================

  getCompanyEvaluations(companyId: number, filters?: any): Observable<any[]> {
    let evaluations = this.read(this.evaluationsKey)
      .filter((e: any) => e.companyId === companyId);

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          evaluations = evaluations.filter((e: any) => e[key] === filters[key]);
        }
      });
    }

    return of(evaluations);
  }

  // ================= ESTADÍSTICAS =================

  getCompanyStatistics(companyId: number): Observable<any> {
    const students = this.read(this.studentsKey)
      .filter((s: any) => s.companyId === companyId);

    const evaluations = this.read(this.evaluationsKey)
      .filter((e: any) => e.companyId === companyId);

    return of({
      totalStudents: students.length,
      totalEvaluations: evaluations.length,
      approved: evaluations.filter((e: any) => e.score >= 7).length,
      failed: evaluations.filter((e: any) => e.score < 7).length
    });
  }

  // ================= REPORTE (SIMULADO) =================

  generateCompanyReport(companyId: number, params: any): Observable<Blob> {
    const content = `
      REPORTE DE EMPRESA
      Empresa ID: ${companyId}
      Parámetros: ${JSON.stringify(params)}
      Fecha: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    return of(blob);
  }

  // ================= UTILIDADES =================

  private read(key: string): any[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  private save(key: string, data: any[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private initMockData(): void {
    if (!localStorage.getItem(this.companiesKey)) {
      this.save(this.companiesKey, [
        {
          id: 1,
          name: 'Empresa Alpha',
          internshipTypes: ['PREPROFESIONAL']
        },
        {
          id: 2,
          name: 'Empresa Beta',
          internshipTypes: ['COMUNITARIA']
        }
      ]);
    }

    if (!localStorage.getItem(this.studentsKey)) {
      this.save(this.studentsKey, [
        { id: 1, name: 'Juan', companyId: 1 },
        { id: 2, name: 'Ana', companyId: 1 },
        { id: 3, name: 'Luis', companyId: 2 }
      ]);
    }

    if (!localStorage.getItem(this.evaluationsKey)) {
      this.save(this.evaluationsKey, [
        { id: 1, companyId: 1, score: 8 },
        { id: 2, companyId: 1, score: 6 },
        { id: 3, companyId: 2, score: 9 }
      ]);
    }
  }
}
