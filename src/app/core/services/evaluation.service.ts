import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Evaluation, EvaluationTemplate, TrainingType } from '../models';
import { STORAGE_KEYS } from '../models/constants';
import { TrainingAssignmentService } from './training-assignment.service';

@Injectable({ providedIn: 'root' })
export class EvaluationService {

  private key = STORAGE_KEYS.EVALUATIONS;
  private templates: Record<TrainingType, EvaluationTemplate> = {
    VINCULATION: {
      id: 1,
      name: 'Evaluación Vinculación',
      type: 'VINCULATION',
      fields: [
        { id: 1, name: 'Participación', type: 'number', required: true },
        { id: 2, name: 'Responsabilidad', type: 'number', required: true },
        { id: 3, name: 'Observaciones', type: 'textarea', required: false }
      ]
    },
    DUAL_PRACTICE: {
      id: 2,
      name: 'Evaluación Prácticas Dual',
      type: 'DUAL_PRACTICE',
      fields: [
        { id: 1, name: 'Competencias técnicas', type: 'number', required: true },
        { id: 2, name: 'Trabajo en equipo', type: 'number', required: true },
        { id: 3, name: 'Cumplimiento de objetivos', type: 'number', required: true },
        { id: 4, name: 'Comentarios del tutor', type: 'textarea', required: false }
      ]
    },
    PREPROFESSIONAL_PRACTICE: {
      id: 3,
      name: 'Evaluación Prácticas Preprofesionales',
      type: 'PREPROFESSIONAL_PRACTICE',
      fields: [
        { id: 1, name: 'Desempeño', type: 'number', required: true },
        { id: 2, name: 'Puntualidad', type: 'number', required: true },
        { id: 3, name: 'Actitud', type: 'number', required: true },
        { id: 4, name: 'Observaciones', type: 'textarea', required: false }
      ]
    }
  };

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

  getTemplateByType(type: TrainingType): Observable<EvaluationTemplate> {
    const template = this.templates[type];
    if (!template) {
      return throwError(() => new Error('Tipo de evaluación no definido'));
    }
    return of(template);
  }

  create(data: {
    studentId: number;
    subjectType: TrainingType;
    templateId?: number;
    fields: Array<{ fieldId: number; value: string }>;
    score: number;
    comments?: string;
    evaluatorId?: number;
  }): Observable<void> {
    const assignment = this.trainingService.getAll().find(a =>
      a.studentId === data.studentId && a.type === data.subjectType
    );

    if (!assignment) {
      return throwError(() => new Error('Asignación no encontrada'));
    }

    const list = this.read();
    list.push({
      id: Date.now(),
      trainingAssignmentId: assignment.id,
      evaluatorId: data.evaluatorId ?? 0,
      grade: data.score,
      comments: data.comments,
      evaluatedAt: new Date().toISOString(),
      templateId: data.templateId,
      fields: data.fields,
      subjectType: data.subjectType,
      studentId: data.studentId
    });

    this.save(list);
    this.trainingService.applyFinalGrade(assignment.id, data.score);

    return of(void 0);
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
