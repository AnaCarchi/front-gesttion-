import { Injectable } from '@angular/core';
import { TrainingAssignment } from '../models';

@Injectable({ providedIn: 'root' })
export class TrainingAssignmentService {

  private readonly key = 'training_assignments';

  // ===========================
  // LECTURA
  // ===========================

  getAll(): TrainingAssignment[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  getById(id: number): TrainingAssignment | undefined {
    return this.getAll().find(a => a.id === id);
  }

  // ===========================
  // CREACIÓN
  // ===========================

  create(assignment: TrainingAssignment): void {
    const list = this.getAll();

    const newAssignment: TrainingAssignment = {
      ...assignment,
      id: assignment.id && assignment.id !== 0 ? assignment.id : Date.now()
    };

    list.push(newAssignment);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  // ===========================
  // ACTUALIZACIÓN
  // ===========================

  update(assignment: TrainingAssignment): void {
    const list = this.getAll().map(a =>
      a.id === assignment.id ? assignment : a
    );

    localStorage.setItem(this.key, JSON.stringify(list));
  }

  // ===========================
  // ELIMINACIÓN
  // ===========================

  delete(id: number): void {
    const list = this.getAll().filter(a => a.id !== id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  // ===========================
  // APLICAR NOTA FINAL
  // (USADO POR EvaluationService)
  // ===========================

  applyFinalGrade(assignmentId: number, grade: number): void {
    const list = this.getAll().map(a => {
      if (a.id !== assignmentId) return a;

      return {
        ...a,
        grade,
        status: grade >= 7 ? 'APPROVED' : 'FAILED'
      };
    });

    localStorage.setItem(this.key, JSON.stringify(list));
  }
}
