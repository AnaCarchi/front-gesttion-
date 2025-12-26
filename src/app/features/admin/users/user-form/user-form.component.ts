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
        <a routerLink="/admin/users" class="back-link">
          <span class="material-icons">arrow_back</span>
          Volver
        </a>
        <h1>{{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</h1>
        <p>{{ isEditMode ? 'Modificar información del usuario' : 'Crear un nuevo usuario del sistema' }}</p>
      </div>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">

        <!-- Información de Cuenta -->
        <div class="form-card">
          <h2>
            <span class="material-icons">vpn_key</span>
            Información de Cuenta
          </h2>

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
          <h2>
            <span class="material-icons">person</span>
            Información Personal
          </h2>

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
            [disabled]="userForm.invalid || loading"
          >
            <span *ngIf="!loading">
              {{ isEditMode ? 'Actualizar Usuario' : 'Crear Usuario' }}
            </span>
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
 /* ================= CONTENEDOR GENERAL ================= */
.user-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  min-height: 100vh;
  background-image:
    linear-gradient(
      rgba(15, 23, 42, 0.75),
      rgba(15, 23, 42, 0.75)
    ),
    url('https://yavirac.edu.ec/wp-content/uploads/2024/05/vision.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

/* ================= HEADER ================= */
.form-header {
  margin-bottom: 36px;
}

.form-header .back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #93c5fd;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
}

.form-header .back-link:hover {
  text-decoration: underline;
}

.form-header h1 {
  font-size: 34px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.form-header p {
  font-size: 15px;
  color: #e5e7eb;
  margin: 0;
}

/* ================= FORM ================= */
.user-form {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* ================= CARD ================= */
.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 18px;
  padding: 32px;
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.25);
}

.form-card h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 26px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

/* ================= GRID ================= */
.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-bottom: 22px;
}

.form-row:last-child {
  margin-bottom: 0;
}

/* ================= INPUTS ================= */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.form-control {
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid #e5e7eb;
  font-size: 14px;
  background: #f8fafc;
  transition: all 0.25s ease;
  font-family: inherit;
}

.form-control::placeholder {
  color: #9ca3af;
}

.form-control:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
}

/* ================= INVALID ================= */
.form-control.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
}

.invalid-feedback {
  font-size: 13px;
  color: #dc2626;
  margin-top: 6px;
  font-weight: 500;
}

/* ================= TEXTAREA ================= */
textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

/* ================= ACTIONS ================= */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 12px;
}

/* ================= BUTTON STATES ================= */
.loading-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ================= ALERTS ================= */
.alert {
  padding: 16px 20px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
}

.alert-danger {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

/* ================= RESPONSIVE ================= */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }

  .form-header {
    text-align: center;
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