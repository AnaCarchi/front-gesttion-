import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private storageKey = 'users';

  constructor() {}

  // ================= CRUD =================

  getAll(): Observable<User[]> {
    return of(this.read()).pipe(delay(300));
  }

  getById(id: number): Observable<User> {
    const user = this.read().find(u => u.id === id);
    return of(user!).pipe(delay(300));
  }

  getTutors(): Observable<User[]> {
    const tutors = this.read().filter(u =>
      u.roles?.some(r => r.name === 'TUTOR')
    );
    return of(tutors).pipe(delay(300));
  }

  create(user: User): Observable<User> {
    const users = this.read();
    user.id = Date.now();
    users.push(user);
    this.save(users);
    return of(user).pipe(delay(300));
  }

  update(id: number, user: User): Observable<User> {
    const users = this.read();
    const index = users.findIndex(u => u.id === id);

    if (index !== -1) {
      users[index] = { ...user, id };
      this.save(users);
      return of(users[index]).pipe(delay(300));
    }

    throw new Error('Usuario no encontrado');
  }

  delete(id: number): Observable<void> {
    const users = this.read().filter(u => u.id !== id);
    this.save(users);
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
