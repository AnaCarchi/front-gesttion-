import { Injectable } from '@angular/core';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly storageKey = 'users';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // ===========================
  // LECTURA
  // ===========================

  getAll(): User[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  getById(id: number): User | undefined {
    return this.getAll().find(u => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.getAll().find(u => u.email === email);
  }

  // ===========================
  // CREACIÓN
  // ===========================

  create(user: User): User {
    const users = this.getAll();

    const newUser: User = {
      ...user,
      id: user.id && user.id !== 0 ? user.id : Date.now(),
      roles: user.roles || [],
      isActive: user.isActive ?? true
    };

    users.push(newUser);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
    return newUser;
  }

  // ===========================
  // ACTUALIZACIÓN
  // ===========================

  update(user: User): void {
    const users = this.getAll().map(u =>
      u.id === user.id ? user : u
    );

    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  // ===========================
  // ELIMINACIÓN
  // ===========================

  delete(id: number): void {
    const users = this.getAll().filter(u => u.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  // ===========================
  // ROLES (USADOS EN GUARDS)
  // ===========================

  hasRole(userId: number, roleName: string): boolean {
    const user = this.getById(userId);
    return !!user?.roles?.some(r => r.name === roleName);
  }
}
