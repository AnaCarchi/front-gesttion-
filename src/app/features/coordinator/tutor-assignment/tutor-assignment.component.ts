import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tutor-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">

    <!-- HEADER -->
    <div class="header">
      <h3>Designación de Tutores</h3>

      <button class="btn-primary" (click)="openModal()">
        <span class="material-icons">person_add</span>
        Nuevo Tutor
      </button>
    </div>

    <!-- TABLE -->
    <table class="table">
      <thead>
        <tr>
          <th>Estudiante</th>
          <th>Carrera</th>
          <th>Tutor Académico</th>
          <th>Tutor Empresarial</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of assignments">
          <td>{{ item.student }}</td>
          <td>{{ item.career }}</td>
          <td>{{ item.academicTutor }}</td>
          <td>{{ item.companyTutor }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MODAL -->
  <div class="modal-backdrop" *ngIf="showModal">
    <div class="modal">

      <div class="modal-header">
        <h4>Crear Tutor</h4>
        <button class="btn-icon" (click)="closeModal()">
          <span class="material-icons">close</span>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Carrera</label>
          <input type="text" [(ngModel)]="newTutor.career">
        </div>

        <div class="form-group">
          <label>Cédula</label>
          <input type="text" [(ngModel)]="newTutor.cedula">
        </div>

        <div class="form-group">
          <label>Nombres</label>
          <input type="text" [(ngModel)]="newTutor.firstName">
        </div>

        <div class="form-group">
          <label>Apellidos</label>
          <input type="text" [(ngModel)]="newTutor.lastName">
        </div>

        <div class="form-group">
          <label>Tipo de Tutor</label>
          <select [(ngModel)]="newTutor.type">
            <option value="academic">Tutor Académico</option>
            <option value="company">Tutor Empresarial</option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" (click)="closeModal()">Cancelar</button>
        <button class="btn-primary" (click)="saveTutor()">Guardar</button>
      </div>

    </div>
  </div>
  `,
  styles: [`
/* CARD */
.card {
  background: white;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

h3 {
  margin: 0;
  color: #0f172a;
}

/* TABLE */
.table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

th {
  color: #2563eb;
  font-weight: 600;
}

/* BUTTONS */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-secondary {
  background: #e5e7eb;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  width: 420px;
  border-radius: 14px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

label {
  font-size: 13px;
  margin-bottom: 4px;
  color: #374151;
}

input, select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}
  `]
})
export class TutorAssignmentComponent {

  showModal = false;

  assignments = [
    {
      student: 'Juan Pérez',
      career: 'Desarrollo de Software',
      academicTutor: 'Ing. María López',
      companyTutor: 'Carlos Gómez'
    }
  ];

  newTutor = {
    career: '',
    cedula: '',
    firstName: '',
    lastName: '',
    type: 'academic'
  };

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveTutor() {
    const fullName = `${this.newTutor.firstName} ${this.newTutor.lastName}`;

    if (this.newTutor.type === 'academic') {
      this.assignments[0].academicTutor = fullName;
    } else {
      this.assignments[0].companyTutor = fullName;
    }

    this.newTutor = {
      career: '',
      cedula: '',
      firstName: '',
      lastName: '',
      type: 'academic'
    };

    this.closeModal();
  }
}
