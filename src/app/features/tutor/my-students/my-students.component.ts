import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page">

      <header class="page-header">
        <h1>
          <span class="material-icons">groups</span>
          Mis Estudiantes
        </h1>
        <span>Listado de estudiantes asignados</span>
      </header>

      <div class="grid" *ngIf="!loading && students.length">

        <article class="card" *ngFor="let student of students">

          <div class="card-top">
            <div class="avatar">
              {{ getInitials(student.person?.name, student.person?.lastname) }}
            </div>

            <div class="info">
              <strong>
                <span class="material-icons">person</span>
                {{ student.person?.name }} {{ student.person?.lastname }}
              </strong>
              <small>
                <span class="material-icons">mail</span>
                {{ student.email }}
              </small>
              <small>
                <span class="material-icons">badge</span>
                {{ student.person?.dni }}
              </small>
            </div>
          </div>

          <div class="divider"></div>

          <div class="row">
            <span>
              <span class="material-icons">school</span>
              Carrera
            </span>
            <b>{{ student.career?.name || 'No asignada' }}</b>
          </div>

          <div class="row">
            <span>
              <span class="material-icons">verified</span>
              Estado SIGA
            </span>
            <span
              class="chip"
              [class.success]="student.isMatriculatedInSIGA"
              [class.warning]="!student.isMatriculatedInSIGA"
            >
              {{ student.isMatriculatedInSIGA ? 'Matriculado' : 'No matriculado' }}
            </span>
          </div>

          <div class="subjects">
            <span class="label">
              <span class="material-icons">menu_book</span>
              Asignaturas
            </span>

            <div class="chips">
              <span
                class="chip outline"
                *ngFor="let subject of student.enrolledSubjects"
              >
                {{ getSubjectLabel(subject.type) }}
              </span>
            </div>
          </div>

          <a
            class="action"
            [routerLink]="['/tutor/evaluate', student.id]"
          >
            <span class="material-icons">rate_review</span>
            Evaluar estudiante
          </a>

        </article>
      </div>

      <!-- EMPTY STATE -->
      <div class="state" *ngIf="!loading && students.length === 0">
        <span class="material-icons" style="font-size:48px;color:#9ca3af">
          groups_off
        </span>
        <h3>No existen estudiantes asignados</h3>
        <p>Comunícate con el coordinador académico</p>
      </div>

      <!-- LOADING -->
      <div class="state" *ngIf="loading">
        <div class="loader"></div>
        <p>
          <span class="material-icons">hourglass_top</span>
          Cargando información...
        </p>
      </div>

    </section>
  `,
 styles: [`
/* CONTENEDOR */
.page {
  max-width: 1400px;
  margin: 0 auto;
}

/* HEADER */
.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.page-header span {
  color: #6b7280;
  font-size: 14px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* CARD */
.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(59,130,246,0.15);
}

/* HEADER CARD */
.card-top {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.info strong {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.info small {
  display: block;
  font-size: 13px;
  color: #6b7280;
}

/* ROWS */
.row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.row span {
  color: #6b7280;
}

.row b {
  font-weight: 600;
  color: #1f2937;
}

/* SUBJECTS */
.subjects .label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
  display: block;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* CHIP */
.chip {
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  background: #fee2e2;
  color: #991b1b;
}

.chip.success {
  background: #d1fae5;
  color: #065f46;
}

.chip.warning {
  background: #ffedd5;
  color: #9a3412;
}

.chip.outline {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #1f2937;
}

/* ACTION */
.action {
  margin-top: auto;
  padding: 10px 12px;
  border-radius: 10px;
  background: #3b82f6;
  color: white;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.action:hover {
  background: #2563eb;
}

/* STATES */
.state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.state h3 {
  font-size: 18px;
  color: #1f2937;
}

.state p {
  color: #6b7280;
}

/* LOADER */
.loader {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
`]

})
export class MyStudentsComponent implements OnInit {

  private studentService = inject(StudentService);

  students: Student[] = [];
  loading = true;

  ngOnInit(): void {
    this.studentService.getMyStudents().subscribe({
      next: res => {
        this.students = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getInitials(name?: string, lastname?: string): string {
    return ((name?.[0] || '') + (lastname?.[0] || '')).toUpperCase();
  }

  getSubjectLabel(type: string): string {
    const map: any = {
      VINCULATION: 'Vinculación',
      DUAL_INTERNSHIP: 'Dual',
      PREPROFESSIONAL_INTERNSHIP: 'Preprofesional'
    };
    return map[type] || type;
  }
}
