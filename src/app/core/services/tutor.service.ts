import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  private storageKey = 'tutors';

  constructor() {}

  // ================= CRUD =================

  getAll(): Observable<User[]> {
    return of(this.read()).pipe(delay(300));
  }

  getById(id: number): Observable<User> {
    const tutor = this.read().find(t => t.id === id);
    return of(tutor!).pipe(delay(300));
  }

  create(tutor: User): Observable<User> {
    const tutors = this.read();
    tutor.id = Date.now();
    tutors.push(tutor);
    this.save(tutors);
    return of(tutor).pipe(delay(300));
  }

  update(id: number, tutor: User): Observable<User> {
    const tutors = this.read();
    const index = tutors.findIndex(t => t.id === id);

    if (index !== -1) {
      tutors[index] = { ...tutor, id };
      this.save(tutors);
      return of(tutors[index]).pipe(delay(300));
    }

    throw new Error('Tutor no encontrado');
  }

  delete(id: number): Observable<void> {
    const tutors = this.read().filter(t => t.id !== id);
    this.save(tutors);
    return of(void 0).pipe(delay(200));
  }

  // ================= STORAGE =================

  private read(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private save(data: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
