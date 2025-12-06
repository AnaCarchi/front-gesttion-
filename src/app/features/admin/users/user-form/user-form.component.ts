import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User, BloodType } from '../../../../core/models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="user-form-container">
      <div class="form-header">
        <a routerLink="/admin/users" class="back-link">← Volver</a>
        <h1>{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</h1>
        <p>{{ isEditMode ? 'Modificar información del usuario' : 'Crear un nuevo usuario del sistema' }}</p>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
        <!-- Información de Cuenta -->
        <div class="form-card">
          <h2>🔐 Información de Cuenta</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-control"
                placeholder="usuario@ejemplo.com"
                [class.is-invalid]="isFieldInvalid('email')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                <span *ngIf="userForm.get('email')?.errors?.['required']">El email es requerido</span>
                <span *ngIf="userForm.get('email')?.errors?.['email']">Email inválido</span>
              </div>
            </div>

            <div class="form-group" *ngIf="!isEditMode">
              <label for="password">Contraseña *</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                class="form-control"
                placeholder="••••••••"
                [class.is-invalid]="isFieldInvalid('password')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                <span *ngIf="userForm.get('password')?.errors?.['required']">La contraseña es requerida</span>
                <span *ngIf="userForm.get('password')?.errors?.['minlength']">Mínimo 6 caracteres</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="status">Estado *</label>
              <select
                id="status"
                formControlName="status"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('status')"
              >
                <option value="">Seleccione un estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <div class="invalid-feedback" *ngIf="isFieldInvalid('status')">
                El estado es requerido
              </div>
            </div>
          </div>
        </div>

        <!-- Información Personal -->
        <div class="form-card" formGroupName="person">
          <h2>👤 Información Personal</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="name">Nombre *</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="form-control"
                placeholder="Juan"
                [class.is-invalid]="isFieldInvalid('person.name')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.name')">
                El nombre es requerido
              </div>
            </div>

            <div class="form-group">
              <label for="lastname">Apellido *</label>
              <input
                type="text"
                id="lastname"
                formControlName="lastname"
                class="form-control"
                placeholder="Pérez"
                [class.is-invalid]="isFieldInvalid('person.lastname')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.lastname')">
                El apellido es requerido
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="dni">Cédula/DNI *</label>
              <input
                type="text"
                id="dni"
                formControlName="dni"
                class="form-control"
                placeholder="1234567890"
                [class.is-invalid]="isFieldInvalid('person.dni')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.dni')">
                La cédula es requerida
              </div>
            </div>

            <div class="form-group">
              <label for="birthdate">Fecha de Nacimiento *</label>
              <input
                type="date"
                id="birthdate"
                formControlName="birthdate"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('person.birthdate')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.birthdate')">
                La fecha de nacimiento es requerida
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="gender">Género *</label>
              <select
                id="gender"
                formControlName="gender"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('person.gender')"
              >
                <option value="">Seleccione</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
              </select>
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.gender')">
                El género es requerido
              </div>
            </div>

            <div class="form-group">
              <label for="bloodtype">Tipo de Sangre *</label>
              <select
                id="bloodtype"
                formControlName="bloodtype"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('person.bloodtype')"
              >
                <option value="">Seleccione</option>
                <option value="O-">O-</option>
                <option value="O+">O+</option>
                <option value="A-">A-</option>
                <option value="A+">A+</option>
                <option value="B-">B-</option>
                <option value="B+">B+</option>
                <option value="AB-">AB-</option>
                <option value="AB+">AB+</option>
              </select>
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.bloodtype')">
                El tipo de sangre es requerido
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phonenumber">Teléfono *</label>
              <input
                type="tel"
                id="phonenumber"
                formControlName="phonenumber"
                class="form-control"
                placeholder="0999999999"
                [class.is-invalid]="isFieldInvalid('person.phonenumber')"
              >
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.phonenumber')">
                El teléfono es requerido
              </div>
            </div>

            <div class="form-group">
              <label for="personEmail">Email Personal</label>
              <input
                type="email"
                id="personEmail"
                formControlName="email"
                class="form-control"
                placeholder="personal@ejemplo.com"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group full-width">
              <label for="address">Dirección *</label>
              <textarea
                id="address"
                formControlName="address"
                class="form-control"
                rows="2"
                placeholder="Dirección completa"
                [class.is-invalid]="isFieldInvalid('person.address')"
              ></textarea>
              <div class="invalid-feedback" *ngIf="isFieldInvalid('person.address')">
                La dirección es requerida
              </div>
            </div>
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
            [disabled]="userForm.invalid || loading"
          >
            <span *ngIf="!loading">{{ isEditMode ? 'Actualizar Usuario' : 'Crear Usuario' }}</span>
            <span *ngIf="loading" class="loading-content">
              <span class="spinner-border spinner-border-sm"></span>
              {{ isEditMode ? 'Actualizando...' : 'Creando...' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .user-form-container {
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

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      h2 {
        font-size: 20px;
        color: #1f2937;
        margin-bottom: 24px;
        font-weight: 600;
        padding-bottom: 16px;
        border-bottom: 2px solid #f3f4f6;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;

      &.full-width {
        grid-column: 1 / -1;
      }

      label {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }

      .form-control {
        padding: 12px 16px;
        border: 1.5px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s;
        background-color: #f9fafb;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: #667eea;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        &.is-invalid {
          border-color: #ef4444;
          background-color: #fef2f2;
        }

        &::placeholder {
          color: #9ca3af;
        }
      }

      textarea.form-control {
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
      }

      .invalid-feedback {
        color: #ef4444;
        font-size: 13px;
        margin-top: 6px;
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

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
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
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;
  userId?: number;

  constructor() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: ['Activo', Validators.required],
      person: this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        dni: ['', Validators.required],
        email: [''],
        phonenumber: ['', Validators.required],
        address: ['', Validators.required],
        bloodtype: ['', Validators.required],
        gender: ['', Validators.required],
        birthdate: ['', Validators.required],
        status: ['Activo']
      })
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.loadUser(this.userId);
      }
    });
  }

  private loadUser(id: number): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          email: user.email,
          status: user.status,
          person: {
            name: user.person?.name,
            lastname: user.person?.lastname,
            dni: user.person?.dni,
            email: user.person?.email,
            phonenumber: user.person?.phonenumber,
            address: user.person?.address,
            bloodtype: user.person?.bloodtype,
            gender: user.person?.gender,
            birthdate: this.formatDateForInput(user.person?.birthdate),
            status: user.person?.status || 'Activo'
          }
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar el usuario';
        this.loading = false;
      }
    });
  }

  private formatDateForInput(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData: any = {
      ...this.userForm.value,
      id: this.userId || 0
    };

    // Si es edición, no enviar password vacío
    if (this.isEditMode && !userData.password) {
      delete userData.password;
    }

    const request = this.isEditMode && this.userId
      ? this.userService.update(this.userId, userData)
      : this.userService.create(userData);

    request.subscribe({
      next: () => {
        this.successMessage = `Usuario ${this.isEditMode ? 'actualizado' : 'creado'} exitosamente`;
        setTimeout(() => {
          this.router.navigate(['/admin/users']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al guardar el usuario';
        this.loading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}