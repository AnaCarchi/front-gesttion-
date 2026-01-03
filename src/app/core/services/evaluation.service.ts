import { Injectable } from '@angular/core';
import { Evaluation } from '../models';
import { STORAGE_KEYS } from '../models/constants';
import { TrainingAssignmentService } from './training-assignment.service';

@Injectable({ providedIn: 'root' })
export class EvaluationService {

  private key = STORAGE_KEYS.EVALUATIONS;

  constructor(
    private trainingService: TrainingAssignmentService
  ) {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  private read(): Evaluation[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  private save(data: Evaluation[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  getByAssignment(assignmentId: number): Evaluation[] {
    return this.read().filter(e => e.trainingAssignmentId === assignmentId);
  }

  evaluate(evaluation: Evaluation): void {
    const data = this.read();

    const newEvaluation: Evaluation = {
      ...evaluation,
      id: Date.now(),
      evaluatedAt: new Date().toISOString()
    };

    data.push(newEvaluation);
    this.save(data);

    // 🔥 Actualiza estado del TrainingAssignment
    this.trainingService.applyFinalGrade(
      newEvaluation.trainingAssignmentId,
      newEvaluation.grade
    );
  }
}
