import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AcademicPeriod, Career, GenericResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  private periods: AcademicPeriod[] = [];
  private careers: Career[] = [];
  private nextPeriodId = 1;
  private nextCareerId = 1;

  private periods$ = new BehaviorSubject<AcademicPeriod[]>([]);

  constructor() {
    // Datos iniciales de ejemplo
    this.create({ 
      name: '2025-1', 
      description: 'Periodo 2025-1', 
      startDate: new Date(), 
      endDate: new Date(), 
      status: 'Activo' 
    }).subscribe();

    this.createCareer(1, { 
      name: 'Ingeniería Informática', 
      description: 'Carrera dual', 
      isDual: true, 
      status: 'Activo' 
    }).subscribe();

    this.createCareer(1, { 
      name: 'Administración', 
      description: 'Carrera tradicional', 
      isDual: false, 
      status: 'Activo' 
    }).subscribe();
  }

  // ================= PERIODOS =================
  getAll(): Observable<AcademicPeriod[]> {
    return this.periods$.asObservable().pipe(delay(500));
  }

  getById(id: number): Observable<AcademicPeriod> {
    const period = this.periods.find(p => p.id === id);
    return of(period!).pipe(delay(300));
  }

  create(period: Partial<AcademicPeriod>): Observable<GenericResponse<AcademicPeriod>> {
    const newPeriod: AcademicPeriod = {
      id: this.nextPeriodId++,
      name: period.name || 'Nuevo Periodo',
      description: period.description,
      startDate: period.startDate || new Date(),
      endDate: period.endDate || new Date(),
      status: period.status || 'Activo',
      careers: period.careers || []
    };

    this.periods.push(newPeriod);
    this.periods$.next(this.periods);

    return of({
      data: newPeriod,
      message: 'Periodo creado',
      status: 200
    }).pipe(delay(300));
  }

  update(id: number, period: AcademicPeriod): Observable<GenericResponse<AcademicPeriod>> {
    const index = this.periods.findIndex(p => p.id === id);
    if (index !== -1) {
      this.periods[index] = { ...period, id };
      this.periods$.next(this.periods);
      return of({
        data: this.periods[index],
        message: 'Periodo actualizado',
        status: 200
      }).pipe(delay(300));
    }
    throw new Error('Periodo no encontrado');
  }

  delete(id: number): Observable<void> {
    this.periods = this.periods.filter(p => p.id !== id);
    this.periods$.next(this.periods);
    this.careers = this.careers.filter(c => c.periodId !== id);
    return of(void 0).pipe(delay(200));
  }

  // ================= CARRERAS =================
  getCareers(periodId: number): Observable<Career[]> {
    const careers = this.careers.filter(c => c.periodId === periodId);
    return of(careers).pipe(delay(300));
  }

  createCareer(periodId: number, career: Partial<Career>): Observable<GenericResponse<Career>> {
    const newCareer: Career = {
      id: this.nextCareerId++,
      periodId,
      name: career.name || 'Nueva Carrera',
      description: career.description || '',
      isDual: career.isDual || false,
      status: career.status || 'Activo'
    };

    this.careers.push(newCareer);

    return of({
      data: newCareer,
      message: 'Carrera creada',
      status: 200
    }).pipe(delay(300));
  }

  updateCareer(id: number, career: Career): Observable<GenericResponse<Career>> {
    const index = this.careers.findIndex(c => c.id === id);
    if (index !== -1) {
      this.careers[index] = career;
      return of({
        data: this.careers[index],
        message: 'Carrera actualizada',
        status: 200
      }).pipe(delay(300));
    }
    throw new Error('Carrera no encontrada');
  }

  deleteCareer(id: number): Observable<void> {
    this.careers = this.careers.filter(c => c.id !== id);
    return of(void 0).pipe(delay(200));
  }
}
