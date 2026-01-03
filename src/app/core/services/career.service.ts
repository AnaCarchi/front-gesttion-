import { Injectable } from '@angular/core';
import { Career } from '../models/career.model';

@Injectable({ providedIn: 'root' })
export class CareerService {

  private storageKey = 'careers';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getAll(): Career[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getById(id: number): Career | undefined {
    return this.getAll().find(c => c.id === id);
  }

  /** 🔗 Carreras por periodo */
  getByPeriod(periodId: number): Career[] {
    return this.getAll().filter(c => c.academicPeriodId === periodId);
  }

  create(career: Career): Career {
    const careers = this.getAll();
    career.id = Date.now();
    careers.push(career);
    localStorage.setItem(this.storageKey, JSON.stringify(careers));
    return career;
  }

  update(career: Career): void {
    const updated = this.getAll().map(c =>
      c.id === career.id ? career : c
    );
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  delete(id: number): void {
    const filtered = this.getAll().filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}
