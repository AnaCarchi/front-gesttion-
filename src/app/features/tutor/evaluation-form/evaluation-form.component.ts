import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TrainingAssignmentService } from '../../../core/services/training-assignment.service';

@Component({
  selector: 'app-evaluation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Evaluación Académica</h2>

    <p><strong>Estudiante:</strong> {{ assignment?.studentName }}</p>

    <label>Nota final</label>
    <input type="number" [(ngModel)]="grade" />

    <button (click)="save()">Guardar</button>
  `,
  styles: [`
    label {
      display: block;
      margin-top: 12px;
    }
    input {
      width: 120px;
      margin-top: 4px;
    }
    button {
      margin-top: 16px;
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
    }
  `]
})
export class EvaluationFormComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private assignmentService = inject(TrainingAssignmentService);

  assignment: any;
  grade = 0;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.assignment = this.assignmentService.getById(id);
  }

  save(): void {
    this.assignment.grade = this.grade;
    this.assignment.status = this.grade >= 7 ? 'APPROVED' : 'FAILED';

    this.assignmentService.update(this.assignment);
    this.router.navigate(['/tutor/my-students']);
  }
}
