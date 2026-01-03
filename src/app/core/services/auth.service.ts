import { Injectable } from '@angular/core';
import { User } from '../models';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly currentUserKey = 'current_user';

  constructor(private userService: UserService) {}

  // ===========================
  // LOGIN
  // ===========================
  login(email: string, password: string): User | null {
    const user = this.userService.getAll().find(u =>
      u.email === email &&
      u.password === password
    );

    if (!user) return null;

    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return user;
  }

  // ===========================
  // LOGOUT
  // ===========================
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  // ===========================
  // USUARIO ACTUAL
  // ===========================
  getCurrentUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem(this.currentUserKey) || 'null');
    } catch {
      return null;
    }
  }

  // ===========================
  // SESIÓN
  // ===========================
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  // ===========================
  // ROLES
  // ===========================
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user?.roles?.some(r => r.name === role);
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return !!user?.roles?.some(r => roles.includes(r.name));
  }
}
