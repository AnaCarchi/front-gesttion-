import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { TrainingAssignmentService } from '../../../../core/services/training-assignment.service';
import { UserService } from '../../../../core/services/user.service';
import { CareerService } from '../../../../core/services/career.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  Career,
  EvaluationTemplate,
  Student,
  TrainingType,
  User
} from '../../../../core/models';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="evaluation-form-container">

      <!-- HEADER -->
      <div class="header">
        <a routerLink="/tutor-enterprise/my-students" class="back-link">
          <span class="material-icons">arrow_back</span>
          Volver
        </a>
        <h1>
          <span class="material-icons">edit_note</span>
          Evaluar Estudiante
        </h1>
      </div>

      <!-- INFO ESTUDIANTE -->
      <div class="student-info-card" *ngIf="student">
        <div class="student-header">
          <div class="student-avatar">
            {{ getInitials(studentUser?.person?.name, studentUser?.person?.lastname) }}
          </div>

          <div class="student-details">
            <h2>
              <span class="material-icons">person</span>
              {{ studentUser?.person?.name }} {{ studentUser?.person?.lastname }}
            </h2>

            <div class="student-meta">
              <span>
                <span class="material-icons">mail</span>
                {{ studentUser?.email }}
              </span>
              <span>
                <span class="material-icons">school</span>
                {{ studentCareer?.name || 'Sin carrera' }}
              </span>
            </div>
          </div>
        </div>

        <!-- SELECCIÓN ASIGNATURA -->
        <div
          class="subject-selection"
          *ngIf="availableSubjects.length > 1"
        >
          <label>
            <span class="material-icons">library_books</span>
            Selecciona la asignatura
          </label>

          <div class="subjects-grid">
            <button
              *ngFor="let subject of availableSubjects"
              type="button"
              class="subject-btn"
              [class.selected]="selectedSubjectType === subject"
              (click)="selectSubject(subject)"
            >
              <span class="material-icons">assignment</span>
              {{ getSubjectName(subject) }}
            </button>
          </div>
        </div>
      </div>

      <!-- FORMULARIO -->
      <form
        *ngIf="template && selectedSubjectType"
        [formGroup]="evaluationForm"
        (ngSubmit)="onSubmit()"
      >
        <div class="form-card">

          <div class="form-header">
            <h2>
              <span class="material-icons">description</span>
              {{ template.name }}
            </h2>
            <span class="template-type">
              <span class="material-icons">bookmark</span>
              {{ getSubjectName(selectedSubjectType) }}
            </span>
          </div>

          <!-- CAMPOS -->
          <div class="fields-container" formArrayName="fields">
            <div
              class="field-group"
              *ngFor="let field of fieldsArray.controls; let i = index"
              [formGroupName]="i"
            >
              <label>
                <span class="material-icons">edit</span>
                {{ template.fields[i].name }}
                <span class="required" *ngIf="template.fields[i].required">*</span>
              </label>

              <input
                *ngIf="template.fields[i].type === 'text'"
                class="form-control"
                formControlName="value"
                [class.is-invalid]="isFieldInvalid(i)"
              />

              <input
                *ngIf="template.fields[i].type === 'number'"
                type="number"
                class="form-control"
                formControlName="value"
                min="0"
                max="10"
                step="0.1"
                [class.is-invalid]="isFieldInvalid(i)"
              />

              <select
                *ngIf="template.fields[i].type === 'select'"
                class="form-control"
                formControlName="value"
                [class.is-invalid]="isFieldInvalid(i)"
              >
                <option value="">Seleccione</option>
                <option
                  *ngFor="let opt of template.fields[i].options"
                  [value]="opt"
                >
                  {{ opt }}
                </option>
              </select>

              <textarea
                *ngIf="template.fields[i].type === 'textarea'"
                rows="4"
                class="form-control"
                formControlName="value"
                [class.is-invalid]="isFieldInvalid(i)"
              ></textarea>

              <div class="invalid-feedback" *ngIf="isFieldInvalid(i)">
                <span class="material-icons">error</span>
                Campo obligatorio
              </div>
            </div>
          </div>

          <!-- SCORE -->
          <div class="score-section">
            <label>
              <span class="material-icons">star</span>
              Calificación general
            </label>
            <input
              type="number"
              class="form-control score-input"
              formControlName="score"
              min="0"
              max="10"
            />
          </div>

          <!-- COMENTARIOS -->
          <div class="comments-section">
            <label>
              <span class="material-icons">comment</span>
              Comentarios
            </label>
            <textarea
              class="form-control"
              rows="5"
              formControlName="comments"
            ></textarea>
          </div>
        </div>

        <!-- MENSAJES -->
        <div class="alert alert-danger" *ngIf="errorMessage">
          <span class="material-icons">error_outline</span>
          {{ errorMessage }}
        </div>

        <div class="alert alert-success" *ngIf="successMessage">
          <span class="material-icons">check_circle</span>
          {{ successMessage }}
        </div>

        <!-- ACCIONES -->
        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            routerLink="/tutor-enterprise/my-students"
          >
            <span class="material-icons">close</span>
            Cancelar
          </button>

          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="evaluationForm.invalid || submitting"
          >
            <span class="material-icons">save</span>
            Guardar Evaluación
          </button>
        </div>
      </form>

      <!-- LOADING -->
      <div class="loading-spinner" *ngIf="loading">
        <div class="spinner"></div>
        <span class="material-icons">hourglass_top</span>
        Cargando...
      </div>
    </div>
  `,
  styles: [`
:host {
  --blue: #2563eb;
  --blue-dark: #1e40af;
  --blue-soft: #eff6ff;
  --orange: #f97316;
  --black: #111827;
  --gray: #6b7280;
  --border: #e5e7eb;
}

/* CONTAINER */
.evaluation-form-container {
  max-width: 900px;
  margin: 0 auto;
}

/* HEADER */
.header h1 {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* STUDENT CARD */
.student-info-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,.08);
}

.student-header {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
}

.student-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* SUBJECTS */
.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px,1fr));
  gap: 12px;
}

.subject-btn {
  padding: 14px;
  border-radius: 14px;
  border: 2px solid var(--border);
  background: #fff;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
}

.subject-btn.selected {
  background: var(--blue-soft);
  border-color: var(--blue);
  color: var(--blue);
}

/* FORM */
.form-card {
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,.08);
}

/* CONTROLS */
.form-control {
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
}

.form-control.is-invalid {
  border-color: #ef4444;
}

/* ACTIONS */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  color: #fff;
  border: none;
}

/* LOADING */
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`]
})
export class EvaluationFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private evaluationService = inject(EvaluationService);
  private assignmentService = inject(TrainingAssignmentService);
  private userService = inject(UserService);
  private careerService = inject(CareerService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  evaluationForm: FormGroup;
  student?: Student;
  template?: EvaluationTemplate;
  selectedSubjectType?: TrainingType;
  studentUser?: User;
  studentCareer?: Career;
  availableSubjects: TrainingType[] = [];

  loading = true;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  studentId?: number;

  constructor() {
    this.evaluationForm = this.fb.group({
      fields: this.fb.array([]),
      score: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      comments: ['']
    });
  }

  get fieldsArray(): FormArray {
    return this.evaluationForm.get('fields') as FormArray;
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.studentId = Number(p['studentId']);
      this.loadStudent();
    });
  }

  loadStudent(): void {
    const student = this.studentService.getById(this.studentId!);
    if (!student) {
      this.errorMessage = 'Estudiante no encontrado';
      this.loading = false;
      return;
    }

    this.student = student;
    this.studentUser = this.userService.getById(student.userId);
    this.studentCareer = this.careerService.getById(student.careerId);

    const assignments = this.assignmentService.getAll().filter(a =>
      a.studentId === student.id
    );

    this.availableSubjects = Array.from(
      new Set(assignments.map(a => a.type))
    );

    if (this.availableSubjects.length === 1) {
      this.selectSubject(this.availableSubjects[0]);
    }

    if (this.availableSubjects.length === 0) {
      this.errorMessage = 'El estudiante no tiene asignaturas registradas';
    }

    this.loading = false;
  }

  selectSubject(type: TrainingType): void {
    this.selectedSubjectType = type;
    this.evaluationService.getTemplateByType(type).subscribe({
      next: template => {
        this.template = template;
        this.buildForm();
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la plantilla de evaluación';
      }
    });
  }

  buildForm(): void {
    this.fieldsArray.clear();
    this.template?.fields.forEach(f => {
      this.fieldsArray.push(
        this.fb.group({
          fieldId: [f.id],
          value: ['', f.required ? Validators.required : []]
        })
      );
    });
  }

  onSubmit(): void {
    if (this.evaluationForm.invalid) return;

    this.submitting = true;

    const data = {
      studentId: this.studentId,
      subjectType: this.selectedSubjectType!,
      templateId: this.template?.id,
      evaluatorId: this.auth.getCurrentUser()?.id,
      ...this.evaluationForm.value
    };

    this.evaluationService.create(data).subscribe({
      next: () => {
        this.successMessage = 'Evaluación guardada correctamente';
        setTimeout(
          () => this.router.navigate(['/tutor-enterprise/my-students']),
          1500
        );
      },
      error: () => {
        this.errorMessage = 'Error al guardar evaluación';
        this.submitting = false;
      }
    });
  }

  isFieldInvalid(i: number): boolean {
    const c = this.fieldsArray.at(i).get('value');
    return !!(c?.invalid && c?.touched);
  }

  getInitials(n?: string, l?: string): string {
    return ((n?.[0] || '') + (l?.[0] || '')).toUpperCase();
  }

  getSubjectName(type: string): string {
    return {
      VINCULATION: 'Vinculación',
      DUAL_PRACTICE: 'Prácticas Dual',
      PREPROFESSIONAL_PRACTICE: 'Preprofesionales'
    }[type] || type;
  }
}
