import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User, Role } from '../../../../core/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-assign-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="assign-roles-container">
      <div class="form-header">
        <a routerLink="/admin/users" class="back-link">← Volver</a>
        <h1>Asignar Roles</h1>
        <p *ngIf="user">Gestionar roles para {{ user.person?.name }} {{ user.person?.lastname }}</p>
      </div>

      <div class="content-wrapper" *ngIf="!loading">
        <!-- Información del Usuario -->
        <div class="user-info-card" *ngIf="user">
          <div class="user-header">
            <div class="user-avatar-large">
              {{ getInitials(user.person?.name, user.person?.lastname) }}
            </div>
            <div class="user-details">
              <h2>{{ user.person?.name }} {{ user.person?.lastname }}</h2>
              <div class="user-meta">
                <span class="meta-item">✉️ {{ user.email }}</span>
                <span class="meta-item">🆔 {{ user.person?.dni }}</span>
                <span class="meta-item">
                  <span class="status-badge" [class.active]="user.status === 'Activo'">
                    {{ user.status }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- Roles Actuales -->
          <div class="current-roles" *ngIf="user.roles && user.roles.length > 0">
            <h3>Roles Actuales</h3>
            <div class="roles-list">
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
          </div>
        </div>

        <!-- Formulario de Asignación de Roles -->
        <form [formGroup]="rolesForm" (ngSubmit)="onSubmit()" class="roles-form">
          <div class="form-card">
            <h2>🔑 Seleccionar Roles</h2>
            <p class="form-description">Marca los roles que deseas asignar al usuario</p>

            <div class="roles-grid" formArrayName="roles">
              <div 
                *ngFor="let roleControl of rolesArray.controls; let i = index" 
                class="role-checkbox-card"
                [class.selected]="roleControl.value.selected"
              >
                <input
                  type="checkbox"
                  [id]="'role-' + i"
                  [formControlName]="i"
                  (change)="onRoleChange(i)"
                  class="role-checkbox"
                >
                <label [for]="'role-' + i" class="role-label">
                  <div class="role-icon">
                    {{ getRoleIcon(availableRoles[i].name) }}
                  </div>
                  <div class="role-info">
                    <div class="role-name">{{ getRoleName(availableRoles[i].name) }}</div>
                    <div class="role-description">{{ availableRoles[i].description }}</div>
                  </div>
                  <div class="checkmark">
                    <span *ngIf="roleControl.value.selected">✓</span>
                  </div>
                </label>
              </div>
            </div>

            <div class="info-box">
              <h3>ℹ️ Información sobre Roles</h3>
              <ul>
                <li><strong>Administrador:</strong> Acceso completo al sistema</li>
                <li><strong>Coordinador:</strong> Gestión de estudiantes de sus carreras</li>
                <li><strong>Tutor:</strong> Evaluación de estudiantes asignados</li>
                <li><strong>Estudiante:</strong> Acceso a sus asignaturas y documentos</li>
              </ul>
            </div>
          </div>

          <!-- Mensaje de error -->
          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <!-- Mensaje de éxito -->
          <div class="alert alert-success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <!-- Acciones -->
          <div class="form-actions">
            <button type="button" routerLink="/admin/users" class="btn btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="submitting || !hasSelectedRoles()"
            >
              <span *ngIf="!submitting">💾 Guardar Roles</span>
              <span *ngIf="submitting" class="loading-content">
                <span class="spinner-border spinner-border-sm"></span>
                Guardando...
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>
    </div>
  `,
  styles: [`
    .assign-roles-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .form-header {
      margin-bottom: 32px;

      .back-link {
        color: #667eea;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 12px;
        display: inline-block;

        &:hover {
          text-decoration: underline;
        }
      }

      h1 {
        font-size: 32px;
        color: #1f2937;
        margin-bottom: 8px;
        font-weight: 700;
      }

      p {
        color: #6b7280;
        font-size: 16px;
        margin: 0;
      }
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .user-info-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .user-header {
      display: flex;
      gap: 24px;
      align-items: center;
      padding-bottom: 24px;
      border-bottom: 2px solid #f3f4f6;

      .user-avatar-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 32px;
        flex-shrink: 0;
      }

      .user-details {
        flex: 1;

        h2 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .user-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;

          .meta-item {
            font-size: 14px;
            color: #6b7280;
            display: flex;
            align-items: center;
            gap: 6px;
          }
        }
      }
    }

    .current-roles {
      margin-top: 24px;

      h3 {
        font-size: 16px;
        color: #1f2937;
        margin-bottom: 12px;
        font-weight: 600;
      }

      .roles-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    .role-badge {
      padding: 6px 14px;
      border-radius: 12px;
      font-size: 13px;
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

    .roles-form {
      .form-card {
        background: white;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        h2 {
          font-size: 20px;
          color: #1f2937;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .form-description {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 24px;
        }
      }
    }

    .roles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .role-checkbox-card {
      position: relative;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.2s;
      overflow: hidden;

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
      }

      &.selected {
        border-color: #667eea;
        background: #f5f7ff;

        .checkmark {
          background: #667eea;
          color: white;
        }
      }

      .role-checkbox {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      .role-label {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 20px;
        cursor: pointer;
        margin: 0;

        .role-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .role-info {
          flex: 1;
          min-width: 0;

          .role-name {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
          }

          .role-description {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.4;
          }
        }

        .checkmark {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          flex-shrink: 0;
          transition: all 0.2s;
        }
      }
    }

    .info-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 16px;
      margin-top: 24px;

      h3 {
        font-size: 14px;
        color: #1e40af;
        margin-bottom: 12px;
        font-weight: 600;
      }

      ul {
        margin: 0;
        padding-left: 20px;

        li {
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 8px;
          line-height: 1.5;

          strong {
            font-weight: 600;
          }
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 8px;
    }

    .loading-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .alert {
      padding: 16px 20px;
      border-radius: 8px;
      font-size: 14px;
      border: 1px solid transparent;
      margin-bottom: 16px;
    }

    .alert-danger {
      background: #fee2e2;
      color: #991b1b;
      border-color: #fecaca;
    }

    .alert-success {
      background: #d1fae5;
      color: #065f46;
      border-color: #a7f3d0;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      background: white;
      border-radius: 12px;

      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin-bottom: 16px;
      }

      p {
        color: #6b7280;
        font-size: 14px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .roles-grid {
        grid-template-columns: 1fr;
      }

      .user-header {
        flex-direction: column;
        text-align: center;

        .user-meta {
          justify-content: center;
        }
      }

      .form-actions {
        flex-direction: column-reverse;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class AssignRolesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  rolesForm: FormGroup;
  user?: User;
  availableRoles: Role[] = [];
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  userId?: number;

  constructor() {
    this.rolesForm = this.fb.group({
      roles: this.fb.array([])
    });
  }

  get rolesArray(): FormArray {
    return this.rolesForm.get('roles') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = +params['id'];
        this.loadData();
      }
    });
  }

  private loadData(): void {
    this.loading = true;
    
    // Cargar usuario y roles disponibles
    Promise.all([
      this.loadUser(this.userId!),
      this.loadAvailableRoles()
    ]).then(() => {
      this.initializeRolesForm();
      this.loading = false;
    }).catch(error => {
      this.errorMessage = 'Error al cargar la información';
      this.loading = false;
    });
  }

  private loadUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getById(id).subscribe({
        next: (user) => {
          this.user = user;
          resolve();
        },
        error: reject
      });
    });
  }

  private loadAvailableRoles(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<Role[]>(`${environment.apiUrl}/admin/roles`).subscribe({
        next: (roles) => {
          this.availableRoles = roles;
          resolve();
        },
        error: reject
      });
    });
  }

  private initializeRolesForm(): void {
    this.rolesArray.clear();
    
    this.availableRoles.forEach(role => {
      const isSelected = this.user?.roles?.some(ur => ur.id === role.id) || false;
      this.rolesArray.push(this.fb.group({
        roleId: [role.id],
        selected: [isSelected]
      }));
    });
  }

  onRoleChange(index: number): void {
    const roleControl = this.rolesArray.at(index);
    const currentValue = roleControl.get('selected')?.value;
    roleControl.patchValue({ selected: !currentValue });
  }

  hasSelectedRoles(): boolean {
    return this.rolesArray.controls.some(control => control.get('selected')?.value);
  }

  onSubmit(): void {
    if (!this.hasSelectedRoles()) {
      this.errorMessage = 'Debes seleccionar al menos un rol';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const selectedRoleIds = this.rolesArray.controls
      .filter(control => control.get('selected')?.value)
      .map(control => control.get('roleId')?.value);

    this.http.post(`${environment.apiUrl}/admin/users/${this.userId}/roles`, {
      roleIds: selectedRoleIds
    }).subscribe({
      next: () => {
        this.successMessage = 'Roles asignados exitosamente';
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al asignar roles';
        this.submitting = false;
      }
    });
  }

  getInitials(name?: string, lastname?: string): string {
    const n = name?.charAt(0) || '';
    const l = lastname?.charAt(0) || '';
    return (n + l).toUpperCase() || 'U';
  }

  getRoleName(role: string): string {
    const names: { [key: string]: string } = {
      'ROLE_ADMIN': 'Administrador',
      'ROLE_COORDINATOR': 'Coordinador',
      'ROLE_TUTOR': 'Tutor Empresarial',
      'ROLE_STUDENT': 'Estudiante'
    };
    return names[role] || role;
  }

  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      'ROLE_ADMIN': '⚙️',
      'ROLE_COORDINATOR': '📊',
      'ROLE_TUTOR': '👔',
      'ROLE_STUDENT': '🎓'
    };
    return icons[role] || '👤';
  }
}