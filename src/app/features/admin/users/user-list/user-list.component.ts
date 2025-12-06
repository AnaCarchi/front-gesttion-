import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="user-list">
      <div class="list-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Administración de usuarios del sistema</p>
        </div>
        <a routerLink="/admin/users/new" class="btn btn-primary">
          ➕ Nuevo Usuario
        </a>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filter-tabs">
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'all'"
            (click)="filterByRole('all')"
          >
            Todos ({{ users.length }})
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'admin'"
            (click)="filterByRole('admin')"
          >
            Administradores
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'coordinator'"
            (click)="filterByRole('coordinator')"
          >
            Coordinadores
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'tutor'"
            (click)="filterByRole('tutor')"
          >
            Tutores
          </button>
          <button 
            class="tab-btn"
            [class.active]="selectedRole === 'student'"
            (click)="filterByRole('student')"
          >
            Estudiantes
          </button>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <div class="users-table-container" *ngIf="!loading && filteredUsers.length > 0">
        <table class="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    {{ getInitials(user.person?.name, user.person?.lastname) }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">
                      {{ user.person?.name }} {{ user.person?.lastname }}
                    </div>
                    <div class="user-dni">{{ user.person?.dni || 'Sin DNI' }}</div>
                  </div>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <div class="roles-badges">
                  <span 
                    *ngFor="let role of user.roles" 
                    class="role-badge"
                    [class.admin]="role.name.toLowerCase().includes('admin')"
                    [class.coordinator]="role.name.toLowerCase().includes('coordinator')"
                    [class.tutor]="role.name.toLowerCase().includes('tutor')"
                    [class.student]="role.name.toLowerCase().includes('student')"
                  >
                    {{ getRoleName(role.name) }}
                  </span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class.active]="user.status === 'Activo'">
                  {{ user.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <a [routerLink]="['/admin/users', user.id, 'edit']" class="btn btn-sm btn-outline">
                    ✏️ Editar
                  </a>
                  <a [routerLink]="['/admin/users', user.id, 'roles']" class="btn btn-sm btn-outline">
                    🔑 Roles
                  </a>
                  <button class="btn btn-sm btn-danger" (click)="deleteUser(user)">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="!loading && filteredUsers.length === 0">
        <div class="empty-icon">👥</div>
        <h3>No hay usuarios</h3>
        <p>{{ selectedRole === 'all' ? 'No hay usuarios registrados' : 'No hay usuarios con este rol' }}</p>
      </div>
    </div>
  `,
  styles: [`
    /* Estilos similares a student-list */
    .filter-tabs {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .tab-btn {
        padding: 10px 20px;
        border: 1.5px solid #e5e7eb;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        transition: all 0.2s;

        &:hover {
          background: #f9fafb;
          border-color: #667eea;
        }

        &.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
      }
    }

    .roles-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      .role-badge {
        padding: 4px 10px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 600;

        &.admin {
          background: #fee2e2;
          color: #991b1b;
        }

        &.coordinator {
          background: #dbeafe;
          color: #1e40af;
        }

        &.tutor {
          background: #fef3c7;
          color: #92400e;
        }

        &.student {
          background: #d1fae5;
          color: #065f46;
        }
      }
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: #fee2e2;
      color: #991b1b;

      &.active {
        background: #d1fae5;
        color: #065f46;
      }
    }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  selectedRole = 'all';

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  filterByRole(role: string): void {
    this.selectedRole = role;
    if (role === 'all') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user => 
        user.roles?.some(r => r.name.toLowerCase().includes(role))
      );
    }
  }

  deleteUser(user: User): void {
    if (confirm(`¿Eliminar a ${user.person?.name || user.email}?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterByRole(this.selectedRole);
        }
      });
    }
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getRoleName(role: string): string {
    const names: { [key: string]: string } = {
      'ROLE_ADMIN': 'Admin',
      'ROLE_COORDINATOR': 'Coordinador',
      'ROLE_TUTOR': 'Tutor',
      'ROLE_STUDENT': 'Estudiante'
    };
    return names[role] || role;
  }
}