import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  AuthRequest,
  AuthResponse,
  GenericResponse,
  GenericOnlyTextResponse,
  User
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const user = this.getStoredUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // ================= LOGIN =================
  login(credentials: AuthRequest): Observable<GenericResponse<AuthResponse>> {

    const user: User = {
      id: 1,
      email: credentials.email,
      status: 'Activo',
      roles: [
        {
          id: 1,
          name: credentials.email.includes('admin') ? 'ADMIN' : 'USER',
          status: 'Activo',
          permissions: []
        }
      ]
    };

    const token = 'fake-jwt-token';

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);

    return of({
      status: 200,
      message: 'Login exitoso',
      data: {
        token
      }
    });
  }

  // ================= REGISTER =================
  register(credentials: AuthRequest): Observable<GenericOnlyTextResponse> {
    return of({
      status: 201,
      message: 'Usuario registrado correctamente'
    });
  }

  // ================= LOGOUT =================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  // ================= TOKEN =================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ================= USER =================
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ================= ROLES =================
  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.some(role => role.name === roleName) || false;
  }

  hasPermission(permissionName: string): boolean {
    const user = this.getCurrentUser();
    return (
      user?.roles?.some(role =>
        role.permissions?.some(p => p.name === permissionName)
      ) || false
    );
  }
}
