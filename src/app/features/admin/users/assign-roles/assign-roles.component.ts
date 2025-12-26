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
        <a routerLink="/admin/users" class="back-link">
          <span class="material-icons">arrow_back</span>
          Volver
        </a>
        <h1>Asignar Roles</h1>
        <p *ngIf="user">Gestionar roles para {{ user.person?.name }} {{ user.person?.lastname }}</p>
      </div>

      <div class="content-wrapper" *ngIf="!loading">
        <div class="user-info-card" *ngIf="user">
          <div class="user-header">
            <div class="user-avatar-large">
              {{ getInitials(user.person?.name, user.person?.lastname) }}
            </div>
            <div class="user-details">
              <h2>{{ user.person?.name }} {{ user.person?.lastname }}</h2>
              <div class="user-meta">
                <span class="meta-item">
                  <span class="material-icons">email</span>
                  {{ user.email }}
                </span>
                <span class="meta-item">
                  <span class="material-icons">badge</span>
                  {{ user.person?.dni }}
                </span>
                <span class="meta-item">
                  <span class="status-badge" [class.active]="user.status === 'Activo'">
                    {{ user.status }}
                  </span>
                </span>
              </div>
            </div>
          </div>

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

        <form [formGroup]="rolesForm" (ngSubmit)="onSubmit()" class="roles-form">
          <div class="form-card">
            <h2>
              <span class="material-icons">vpn_key</span>
              Seleccionar Roles
            </h2>
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
                    <span class="material-icons">
                      {{ getRoleIcon(availableRoles[i].name) }}
                    </span>
                  </div>
                  <div class="role-info">
                    <div class="role-name">{{ getRoleName(availableRoles[i].name) }}</div>
                    <div class="role-description">{{ availableRoles[i].description }}</div>
                  </div>
                  <div class="checkmark">
                    <span class="material-icons" *ngIf="roleControl.value.selected">
                      check
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div class="info-box">
              <h3>
                <span class="material-icons">info</span>
                Información sobre Roles
              </h3>
              <ul>
                <li><strong>Administrador:</strong> Acceso completo al sistema</li>
                <li><strong>Coordinador:</strong> Gestión de estudiantes de sus carreras</li>
                <li><strong>Tutor:</strong> Evaluación de estudiantes asignados</li>
                <li><strong>Estudiante:</strong> Acceso a sus asignaturas y documentos</li>
              </ul>
            </div>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="alert alert-success" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <div class="form-actions">
            <button type="button" routerLink="/admin/users" class="btn btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="submitting || !hasSelectedRoles()"
            >
              <span *ngIf="!submitting">
                <span class="material-icons">save</span>
                Guardar Roles
              </span>
              <span *ngIf="submitting" class="loading-content">
                <span class="spinner-border spinner-border-sm"></span>
                Guardando...
              </span>
            </button>
          </div>
        </form>
      </div>

      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>
    </div>
  `,
  styles: [`
    /* ====== ESTILOS ORIGINALES ====== */
    /* (NO SE ELIMINA NI MODIFICA NADA) */

    /* ====== MATERIAL ICONS ====== */
    .material-icons {
      font-size: 18px;
      vertical-align: middle;
      line-height: 1;
    }

    .back-link .material-icons {
      font-size: 20px;
      margin-right: 6px;
    }

    .meta-item .material-icons {
      font-size: 16px;
      margin-right: 4px;
      color: #6b7280;
    }

    .role-icon .material-icons {
      font-size: 36px;
      color: #4f46e5;
    }

    .checkmark .material-icons {
      font-size: 18px;
    }

    h2 .material-icons,
    h3 .material-icons {
      font-size: 20px;
      margin-right: 6px;
      vertical-align: text-bottom;
    }

    .btn .material-icons {
      font-size: 18px;
      margin-right: 6px;
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

    Promise.all([
      this.loadUser(this.userId!),
      this.loadAvailableRoles()
    ]).then(() => {
      this.initializeRolesForm();
      this.loading = false;
    }).catch(() => {
      this.errorMessage = 'Error al cargar la información';
      this.loading = false;
    });
  }

  private loadUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getById(id).subscribe({
        next: user => {
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
        next: roles => {
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
      const isSelected = this.user?.roles?.some(r => r.id === role.id) || false;
      this.rolesArray.push(this.fb.group({
        roleId: [role.id],
        selected: [isSelected]
      }));
    });
  }

  onRoleChange(index: number): void {
    const control = this.rolesArray.at(index);
    control.patchValue({ selected: !control.value.selected });
  }

  hasSelectedRoles(): boolean {
    return this.rolesArray.controls.some(c => c.get('selected')?.value);
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
      .filter(c => c.get('selected')?.value)
      .map(c => c.get('roleId')?.value);

    this.http.post(`${environment.apiUrl}/admin/users/${this.userId}/roles`, {
      roleIds: selectedRoleIds
    }).subscribe({
      next: () => {
        this.successMessage = 'Roles asignados exitosamente';
        setTimeout(() => this.router.navigate(['/admin/users']), 1500);
      },
      error: () => {
        this.errorMessage = 'Error al asignar roles';
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
      'ROLE_ADMIN': 'settings',
      'ROLE_COORDINATOR': 'leaderboard',
      'ROLE_TUTOR': 'work',
      'ROLE_STUDENT': 'school'
    };
    return icons[role] || 'person';
  }
}
