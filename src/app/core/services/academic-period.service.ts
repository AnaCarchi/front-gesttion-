import { Injectable } from '@angular/core';
import { AcademicPeriod } from '../models/academic-period.model';

@Injectable({ providedIn: 'root' })
export class AcademicPeriodService {

  private storageKey = 'academic_periods';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getAll(): AcademicPeriod[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getById(id: number): AcademicPeriod | undefined {
    return this.getAll().find(p => p.id === id);
  }

  /** Devuelve el periodo activo o el último creado */
  getActive(): AcademicPeriod | undefined {
    const periods = this.getAll();
    return periods.find(p => p.isActive) ?? periods.at(-1);
  }

  create(period: AcademicPeriod): AcademicPeriod {
    const periods = this.getAll();

    // 🔒 Solo un periodo activo
    if (period.isActive) {
      periods.forEach(p => p.isActive = false);
    }

    period.id = Date.now();
    periods.push(period);
    localStorage.setItem(this.storageKey, JSON.stringify(periods));
    return period;
  }

  update(period: AcademicPeriod): void {
    const periods = this.getAll().map(p => {
      if (period.isActive && p.id !== period.id) {
        p.isActive = false;
      }
      return p.id === period.id ? period : p;
    });

    localStorage.setItem(this.storageKey, JSON.stringify(periods));
  }

  delete(id: number): void {
    const filtered = this.getAll().filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}
