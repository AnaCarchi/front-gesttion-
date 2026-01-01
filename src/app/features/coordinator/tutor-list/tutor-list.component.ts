import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">

    <!-- HEADER -->
    <div class="header">
      <h3>Lista de Tutores</h3>
      <button class="btn-primary" (click)="openModal()">
        + Nuevo Tutor
      </button>
    </div>

    <!-- TABLE -->
    <table class="table">
      <thead>
        <tr>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Cédula</th>
          <th>Carrera</th>
          <th>Tipo</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let tutor of tutors">
          <td>{{ tutor.names }}</td>
          <td>{{ tutor.lastnames }}</td>
          <td>{{ tutor.cedula }}</td>
          <td>{{ tutor.career }}</td>
          <td>{{ tutor.type }}</td>
          <td>
            <span
              class="status"
              [class.active]="tutor.active"
              [class.inactive]="!tutor.active">
              {{ tutor.active ? 'Activo' : 'Inactivo' }}
            </span>
          </td>
        </tr>

        <tr *ngIf="tutors.length === 0">
          <td colspan="6" class="empty">
            No hay tutores registrados
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- MODAL -->
  <div class="modal-backdrop" *ngIf="showModal">
    <div class="modal">

      <h4>Nuevo Tutor</h4>

      <form (ngSubmit)="addTutor()">

        <div class="form-group">
          <label>Nombres</label>
          <input type="text" [(ngModel)]="newTutor.names" name="names" required />
        </div>

        <div class="form-group">
          <label>Apellidos</label>
          <input type="text" [(ngModel)]="newTutor.lastnames" name="lastnames" required />
        </div>

        <div class="form-group">
          <label>Cédula</label>
          <input type="text" [(ngModel)]="newTutor.cedula" name="cedula" required />
        </div>

        <div class="form-group">
          <label>Carrera</label>
          <input type="text" [(ngModel)]="newTutor.career" name="career" required />
        </div>

        <div class="form-group">
          <label>Tipo</label>
          <select [(ngModel)]="newTutor.type" name="type" required>
            <option value="">Seleccione</option>
            <option value="Académico">Académico</option>
            <option value="Empresarial">Empresarial</option>
          </select>
        </div>

        <div class="form-group checkbox">
          <label>
            <input type="checkbox" [(ngModel)]="newTutor.active" name="active" />
            Tutor activo
          </label>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" (click)="closeModal()">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            Guardar
          </button>
        </div>

      </form>
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
      margin-bottom: 20px;
    }

    h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
    }

    .btn-primary {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-primary:hover {
      background: #1e40af;
    }

    .btn-secondary {
      background: #e5e7eb;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    /* TABLE */
    .table {
      width: 100%;
      border-collapse: collapse;
    }

    th {
      padding: 12px;
      border-bottom: 2px solid #e5e7eb;
      font-size: 13px;
      text-transform: uppercase;
      color: #2563eb;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
      color: #374151;
    }

    tr:hover {
      background: #f9fafb;
    }

    .empty {
      text-align: center;
      padding: 20px;
      color: #6b7280;
    }

    /* STATUS */
    .status {
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }

    .status.active {
      background: #dcfce7;
      color: #166534;
    }

    .status.inactive {
      background: #fee2e2;
      color: #991b1b;
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
      padding: 24px;
      border-radius: 14px;
      width: 420px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .modal h4 {
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 700;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    .form-group label {
      font-size: 13px;
      margin-bottom: 4px;
      color: #374151;
    }

    .form-group input,
    .form-group select {
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 14px;
    }

    .checkbox {
      margin-top: 8px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
  `]
})
export class TutorListComponent {

  showModal = false;

  tutors = [
    {
      names: 'María',
      lastnames: 'López',
      cedula: '0102030405',
      career: 'Desarrollo de Software',
      type: 'Académico',
      active: true
    }
  ];

  newTutor = this.resetTutor();

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.newTutor = this.resetTutor();
  }

  addTutor() {
    this.tutors.push({ ...this.newTutor });
    this.closeModal();
  }

  resetTutor() {
    return {
      names: '',
      lastnames: '',
      cedula: '',
      career: '',
      type: '',
      active: true
    };
  }
}
