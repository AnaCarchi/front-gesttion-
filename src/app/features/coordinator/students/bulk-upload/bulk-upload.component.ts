import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { UserService } from '../../../../core/services/user.service';
import { StudentService } from '../../../../core/services/student.service';
import { CareerService } from '../../../../core/services/career.service';
import { AcademicPeriodService } from '../../../../core/services/academic-period.service';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Carga Masiva de Estudiantes</h2>

    <p *ngIf="activePeriod">
      Periodo activo:
      <strong>{{ activePeriod.name }}</strong>
    </p>

    <input type="file" accept=".csv" (change)="onFileSelected($event)" />

    <table *ngIf="rows.length">
      <thead>
        <tr>
          <th>Email</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let r of rows">
          <td>{{ r.email }}</td>
          <td>{{ r.firstName }}</td>
          <td>{{ r.lastName }}</td>
          <td>{{ r.status }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table {
      margin-top: 16px;
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      font-size: 14px;
    }
    th {
      background: #f9fafb;
    }
  `]
})
export class BulkUploadComponent {

  private userService = inject(UserService);
  private studentService = inject(StudentService);
  private careerService = inject(CareerService);
  private periodService = inject(AcademicPeriodService);

  activePeriod = this.periodService.getActive();

  rows: any[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => this.processCSV(reader.result as string);
    reader.readAsText(input.files[0]);
  }

  processCSV(content: string): void {
    const lines = content.split('\n').filter(l => l.trim());
    lines.shift(); // eliminar encabezado

    lines.forEach(line => {
      const [email, firstName, lastName, careerId] = line.split(',');

      let user = this.userService.findByEmail(email);

      if (!user) {
        user = this.userService.create({
          id: 0,
          email,
          password: '123456',
          isActive: true,
          person: {
            id: Date.now(),
            name: firstName,
            lastname: lastName,
            identification: ''
          },
          roles: [{ id: Date.now(), name: 'STUDENT' }]
        });
      }

      const existsStudent = this.studentService.getByUserId(user.id);
      if (!existsStudent) {
        this.studentService.create({
          id: 0,
          userId: user.id,
          careerId: Number(careerId),
          academicPeriodId: this.activePeriod!.id,
          isActive: true,
          hasVinculation: true
        });
      }

      this.rows.push({
        email,
        firstName,
        lastName,
        status: 'Registrado'
      });
    });
  }
}
