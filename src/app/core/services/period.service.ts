import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AcademicPeriod, Career, GenericResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  private periodsKey = 'periods';
  private careersKey = 'careers';

  private periods$ = new BehaviorSubject<AcademicPeriod[]>([]);

  constructor() {
    this.loadFromStorage();
    this.initMockData();
  }

  // ================= PERIODOS =================

  getAll(): Observable<AcademicPeriod[]> {
    return this.periods$.asObservable().pipe(delay(300));
  }

  getById(id: number): Observable<AcademicPeriod> {
    const period = this.readPeriods().find(p => p.id === id);
    return of(period!).pipe(delay(300));
  }

  create(period: Partial<AcademicPeriod>): Observable<GenericResponse<AcademicPeriod>> {
    const periods = this.readPeriods();

    const newPeriod: AcademicPeriod = {
      id: Date.now(),
      name: period.name || 'Nuevo Periodo',
      description: period.description,
      startDate: period.startDate || new Date(),
      endDate: period.endDate || new Date(),
      status: period.status || 'Activo',
      careers: []
    };

    periods.push(newPeriod);
    this.savePeriods(periods);

    this.periods$.next(periods);

    return of({
      data: newPeriod,
      message: 'Periodo creado',
      status: 200
    }).pipe(delay(300));
  }

  update(id: number, period: AcademicPeriod): Observable<GenericResponse<AcademicPeriod>> {
    const periods = this.readPeriods();
    const index = periods.findIndex(p => p.id === id);

    if (index !== -1) {
      periods[index] = { ...period, id };
      this.savePeriods(periods);
      this.periods$.next(periods);

      return of({
        data: periods[index],
        message: 'Periodo actualizado',
        status: 200
      }).pipe(delay(300));
    }

    throw new Error('Periodo no encontrado');
  }

  delete(id: number): Observable<void> {
    const periods = this.readPeriods().filter(p => p.id !== id);
    this.savePeriods(periods);
    this.periods$.next(periods);

    const careers = this.readCareers().filter(c => c.periodId !== id);
    this.saveCareers(careers);

    return of(void 0).pipe(delay(200));
  }

  // ================= CARRERAS =================

  getCareers(periodId: number): Observable<Career[]> {
    const careers = this.readCareers().filter(c => c.periodId === periodId);
    return of(careers).pipe(delay(300));
  }

  createCareer(periodId: number, career: Partial<Career>): Observable<GenericResponse<Career>> {
    const careers = this.readCareers();

    const newCareer: Career = {
      id: Date.now(),
      periodId,
      name: career.name || 'Nueva Carrera',
      description: career.description || '',
      isDual: career.isDual || false,
      status: career.status || 'Activo'
    };

    careers.push(newCareer);
    this.saveCareers(careers);

    return of({
      data: newCareer,
      message: 'Carrera creada',
      status: 200
    }).pipe(delay(300));
  }

  updateCareer(id: number, career: Career): Observable<GenericResponse<Career>> {
    const careers = this.readCareers();
    const index = careers.findIndex(c => c.id === id);

    if (index !== -1) {
      careers[index] = career;
      this.saveCareers(careers);

      return of({
        data: careers[index],
        message: 'Carrera actualizada',
        status: 200
      }).pipe(delay(300));
    }

    throw new Error('Carrera no encontrada');
  }

  deleteCareer(id: number): Observable<void> {
    const careers = this.readCareers().filter(c => c.id !== id);
    this.saveCareers(careers);
    return of(void 0).pipe(delay(200));
  }

  // ================= STORAGE =================

  private readPeriods(): AcademicPeriod[] {
    return JSON.parse(localStorage.getItem(this.periodsKey) || '[]');
  }

  private savePeriods(data: AcademicPeriod[]): void {
    localStorage.setItem(this.periodsKey, JSON.stringify(data));
  }

  private readCareers(): Career[] {
    return JSON.parse(localStorage.getItem(this.careersKey) || '[]');
  }

  private saveCareers(data: Career[]): void {
    localStorage.setItem(this.careersKey, JSON.stringify(data));
  }

  private loadFromStorage(): void {
    this.periods$.next(this.readPeriods());
  }

  // ================= DATOS INICIALES =================

  private initMockData(): void {
    if (this.readPeriods().length === 0) {
      this.create({
        name: '2025-1',
        description: 'Periodo 2025-1',
        startDate: new Date(),
        endDate: new Date(),
        status: 'Activo'
      }).subscribe();

      this.createCareer(Date.now(), {
        name: 'Ingeniería Informática',
        description: 'Carrera dual',
        isDual: true,
        status: 'Activo'
      }).subscribe();
    }
  }
}
