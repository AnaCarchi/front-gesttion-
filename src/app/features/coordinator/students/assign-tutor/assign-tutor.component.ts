import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { TutorService } from '../../../../core/services/tutor.service';
import { Student, Tutor } from '../../../../core/models';

@Component({
  selector: 'app-assign-tutor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="assign-tutor">

      <!-- Header -->
      <div class="page-header">
        <button class="btn-back" (click)="goBack()">
          <span class="material-icons">arrow_back</span>
          Volver
        </button>

        <div>
          <h1>Asignar Tutor Académico</h1>
          <p>Asigna un tutor para supervisar las prácticas del estudiante</p>
        </div>
      </div>

      <!-- Loading -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando información...</p>
      </div>

      <!-- Error -->
      <div class="alert alert-error" *ngIf="errorMessage">
        <span class="material-icons alert-icon">error</span>
        <div class="alert-content">
          <strong>Error</strong>
          <p>{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Content -->
      <div class="content-grid" *ngIf="!loading && student">

        <!-- Student card -->
        <div class="info-card">
          <div class="card-header">
            <h2>Información del Estudiante</h2>
          </div>

          <div class="card-body">
            <div class="student-profile">
              <div class="student-avatar">
                {{ getInitials(student.person?.name, student.person?.lastname) }}
              </div>

              <div class="student-details">
                <h3>{{ student.person?.name }} {{ student.person?.lastname }}</h3>

                <div class="detail-row">
                  <span class="label">DNI:</span>
                  <span class="value">{{ student.person?.dni }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">{{ student.email }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Carrera:</span>
                  <span class="value">{{ student.career?.name }}</span>
                </div>

                <div class="detail-row">
                  <span class="label">Estado SIGA:</span>
                  <span class="value status-active" *ngIf="student.isMatriculatedInSIGA">
                    Matriculado
                  </span>
                  <span class="value" *ngIf="!student.isMatriculatedInSIGA">
                    No matriculado
                  </span>
                </div>
              </div>
            </div>

            <!-- Tutor actual -->
            <div class="current-tutor" *ngIf="student.tutor">
              <h4>Tutor Actual</h4>

              <div class="tutor-info-box">
                <div class="tutor-avatar">
                  {{ getInitials(student.tutor.person?.name, student.tutor.person?.lastname) }}
                </div>

                <div>
                  <div class="tutor-name">
                    {{ student.tutor.person?.name }} {{ student.tutor.person?.lastname }}
                  </div>
                  <div class="tutor-email">{{ student.tutor.email }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form card -->
        <div class="form-card">
          <div class="card-header">
            <h2>{{ student.tutor ? 'Cambiar Tutor' : 'Asignar Tutor' }}</h2>
          </div>

          <div class="card-body">
            <form [formGroup]="assignForm" (ngSubmit)="onSubmit()">

              <div class="form-group">
                <label>Seleccionar Tutor Académico *</label>
                <select
                  formControlName="tutorId"
                  class="form-control"
                  [class.error]="assignForm.get('tutorId')?.invalid && assignForm.get('tutorId')?.touched"
                >
                  <option value="">Seleccione un tutor</option>
                  <option *ngFor="let tutor of tutors" [value]="tutor.id">
                    {{ tutor.person?.name }} {{ tutor.person?.lastname }}
                  </option>
                </select>

                <div class="error-message"
                  *ngIf="assignForm.get('tutorId')?.invalid && assignForm.get('tutorId')?.touched">
                  Debe seleccionar un tutor
                </div>
              </div>

              <div class="form-group">
                <label>Observaciones</label>
                <textarea
                  class="form-control"
                  rows="4"
                  formControlName="notes"
                  placeholder="Observaciones adicionales"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="goBack()">
                  Cancelar
                </button>

                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="assignForm.invalid || submitting"
                >
                  {{ submitting ? 'Asignando...' : 'Guardar' }}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      <!-- Success -->
      <div class="alert alert-success" *ngIf="successMessage">
        <span class="material-icons alert-icon">check_circle</span>
        <div class="alert-content">
          <strong>Correcto</strong>
          <p>{{ successMessage }}</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
/* CONTENEDOR */
.assign-tutor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* HEADER */
.page-header {
  margin-bottom: 32px;
}

.btn-back {
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  cursor: pointer;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.page-header p {
  color: #6b7280;
}

/* LOADING */
.loading-spinner {
  text-align: center;
  padding: 60px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ALERTS */
.alert {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
}

.alert-success {
  background: #d1fae5;
  color: #065f46;
}

.alert-icon {
  font-size: 22px;
}

/* GRID */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* CARDS */
.info-card,
.form-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,.1);
}

.card-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.card-body {
  padding: 24px;
}

/* STUDENT */
.student-profile {
  display: flex;
  gap: 16px;
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.detail-row {
  font-size: 14px;
  margin-bottom: 6px;
}

.label {
  color: #6b7280;
}

.status-active {
  color: #065f46;
  font-weight: 600;
}

/* FORM */
.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.form-control.error {
  border-color: #ef4444;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
  `]
})
export class AssignTutorComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private tutorService = inject(TutorService);

  assignForm!: FormGroup;
  student: Student | null = null;
  tutors: Tutor[] = [];
  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.assignForm = this.fb.group({
      tutorId: ['', Validators.required],
      notes: ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudent(+id);
      this.loadTutors();
    }
  }

  loadStudent(id: number): void {
    this.studentService.getById(id).subscribe({
      next: student => {
        this.student = student;
        if (student.tutor) {
          this.assignForm.patchValue({ tutorId: student.tutor.id });
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar estudiante';
        this.loading = false;
      }
    });
  }

  loadTutors(): void {
    this.tutorService.getAll().subscribe(t => this.tutors = t);
  }

  onSubmit(): void {
    if (this.assignForm.invalid || !this.student) return;

    this.submitting = true;

    this.studentService.assignTutor(
      this.student.id!,
      +this.assignForm.value.tutorId
    ).subscribe({
      next: () => {
        this.successMessage = 'Tutor asignado correctamente';
        setTimeout(() => this.router.navigate(['/coordinator/students']), 2000);
      },
      error: () => {
        this.errorMessage = 'Error al asignar tutor';
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/coordinator/students']);
  }

  getInitials(name?: string, lastname?: string): string {
    return ((name?.[0] || '') + (lastname?.[0] || '')).toUpperCase();
  }
}
