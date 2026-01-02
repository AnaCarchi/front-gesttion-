import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Vinculation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VinculationService {

  private storageKey = 'vinculations';

  constructor() {}

  // ================= CRUD =================

  getAll(): Observable<Vinculation[]> {
    return of(this.read()).pipe(delay(300));
  }

  getById(id: number): Observable<Vinculation> {
    const vinculation = this.read().find(v => v.id === id);
    return of(vinculation!).pipe(delay(300));
  }

  create(vinculation: Vinculation): Observable<Vinculation> {
    const data = this.read();
    const newVinculation: Vinculation = {
      ...vinculation,
      id: Date.now()
    };

    data.push(newVinculation);
    this.save(data);

    return of(newVinculation).pipe(delay(300));
  }

  update(vinculation: Vinculation): Observable<Vinculation> {
    const data = this.read();
    const index = data.findIndex(v => v.id === vinculation.id);

    if (index === -1) {
      throw new Error('Vinculación no encontrada');
    }

    data[index] = vinculation;
    this.save(data);

    return of(vinculation).pipe(delay(300));
  }

  delete(id: number): Observable<void> {
    const data = this.read().filter(v => v.id !== id);
    this.save(data);
    return of(void 0).pipe(delay(200));
  }

  // ================= STORAGE =================

  private read(): Vinculation[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private save(data: Vinculation[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
