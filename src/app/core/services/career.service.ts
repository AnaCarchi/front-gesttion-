import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Career, GenericResponse, AcademicPeriod } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CareerService {

  private careersKey = 'careers';
  private periodsKey = 'periods';

  private careers$ = new BehaviorSubject<Career[]>(this.readCareers());
  private periods$ = new BehaviorSubject<AcademicPeriod[]>(this.readPeriods());

  constructor() {}

  // ================= CAREERS =================

  getAll(): Observable<Career[]> {
    return this.careers$.asObservable().pipe(delay(100));
  }

  getById(id: number): Observable<Career> {
    const career = this.readCareers().find(c => c.id === id);
    return of(career!).pipe(delay(100));
  }

  create(career: Partial<Career>): Observable<GenericResponse<Career>> {
    const careers = this.readCareers();
    const periods = this.readPeriods();

    const newCareer: Career = {
      id: Date.now(),
      name: career.name || '',
      description: career.description || '',
      isDual: career.isDual || false,
      status: career.status || 'Activo',
      periodId: career.periodId || 0,
      academicPeriod: undefined
    };

    careers.push(newCareer);

    const period = periods.find(p => p.id === newCareer.periodId);
    if (period) {
      period.careers = period.careers || [];
      period.careers.push(newCareer);
    }

    this.saveCareers(careers);
    this.savePeriods(periods);

    this.careers$.next(careers);
    this.periods$.next(periods);

    return of({ data: newCareer, message: 'Carrera creada', status: 200 }).pipe(delay(100));
  }

  update(id: number, career: Career): Observable<GenericResponse<Career>> {
    const careers = this.readCareers();
    const periods = this.readPeriods();

    const index = careers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Carrera no encontrada');

    const oldCareer = careers[index];

    // Remover del periodo anterior
    if (oldCareer.periodId !== career.periodId) {
      const oldPeriod = periods.find(p => p.id === oldCareer.periodId);
      if (oldPeriod?.careers) {
        oldPeriod.careers = oldPeriod.careers.filter(c => c.id !== id);
      }
    }

    // Asociar nuevo periodo
    const newPeriod = periods.find(p => p.id === career.periodId);
    if (newPeriod) {
      newPeriod.careers = newPeriod.careers || [];
      if (!newPeriod.careers.find(c => c.id === id)) {
        newPeriod.careers.push({ ...career, id });
      }
    }

    careers[index] = { ...career, id };

    this.saveCareers(careers);
    this.savePeriods(periods);

    this.careers$.next(careers);
    this.periods$.next(periods);

    return of({ data: careers[index], message: 'Carrera actualizada', status: 200 }).pipe(delay(100));
  }

  delete(id: number): Observable<void> {
    let careers = this.readCareers();
    const periods = this.readPeriods();

    const career = careers.find(c => c.id === id);
    if (career) {
      const period = periods.find(p => p.id === career.periodId);
      if (period?.careers) {
        period.careers = period.careers.filter(c => c.id !== id);
      }
    }

    careers = careers.filter(c => c.id !== id);

    this.saveCareers(careers);
    this.savePeriods(periods);

    this.careers$.next(careers);
    this.periods$.next(periods);

    return of(void 0).pipe(delay(100));
  }

  getByCoordinator(): Observable<Career[]> {
    return this.getAll();
  }

  // ================= PERIODS =================

  getPeriods(): Observable<AcademicPeriod[]> {
    return this.periods$.asObservable().pipe(delay(100));
  }

  // ================= STORAGE =================

  private readCareers(): Career[] {
    return JSON.parse(localStorage.getItem(this.careersKey) || '[]');
  }

  private saveCareers(data: Career[]): void {
    localStorage.setItem(this.careersKey, JSON.stringify(data));
  }

  private readPeriods(): AcademicPeriod[] {
    return JSON.parse(localStorage.getItem(this.periodsKey) || '[]');
  }

  private savePeriods(data: AcademicPeriod[]): void {
    localStorage.setItem(this.periodsKey, JSON.stringify(data));
  }
}
