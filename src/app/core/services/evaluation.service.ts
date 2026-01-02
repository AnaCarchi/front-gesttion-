import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evaluation, EvaluationTemplate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

  private evaluationsKey = 'evaluations';
  private templatesKey = 'evaluationTemplates';

  constructor() {
    this.initMockData();
  }

  // ================= PLANTILLAS =================
  getTemplateByType(type: string): Observable<EvaluationTemplate> {
    const templates = this.read(this.templatesKey);
    const template = templates.find((t: any) => t.type === type);
    return of(template);
  }

  // ================= CREAR =================
  create(evaluation: any): Observable<Evaluation> {
    const evaluations = this.read(this.evaluationsKey);

    const newEvaluation: Evaluation = {
      ...evaluation,
      id: Date.now(),
      createdAt: new Date()
    };

    evaluations.push(newEvaluation);
    this.save(this.evaluationsKey, evaluations);

    return of(newEvaluation);
  }

  // ================= POR ESTUDIANTE =================
  getByStudent(studentId: number): Observable<Evaluation[]> {
    const evaluations = this.read(this.evaluationsKey)
      .filter((e: any) => e.studentId === studentId);

    return of(evaluations);
  }

  // ================= POR TUTOR =================
  getByTutor(): Observable<Evaluation[]> {
    const evaluations = this.read(this.evaluationsKey);
    return of(evaluations);
  }

  // ================= ACTUALIZAR =================
  update(id: number, evaluation: Evaluation): Observable<Evaluation> {
    const evaluations = this.read(this.evaluationsKey);

    const index = evaluations.findIndex((e: any) => e.id === id);
    if (index !== -1) {
      evaluations[index] = { ...evaluations[index], ...evaluation };
      this.save(this.evaluationsKey, evaluations);
    }

    return of(evaluations[index]);
  }

  // ================= UTILIDADES =================
  private read(key: string): any[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  private save(key: string, data: any[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ================= DATOS INICIALES =================
  private initMockData(): void {

    if (!localStorage.getItem(this.templatesKey)) {
      this.save(this.templatesKey, [
        {
          type: 'EMPRESA',
          questions: [
            { id: 1, text: 'Responsabilidad', maxScore: 10 },
            { id: 2, text: 'Puntualidad', maxScore: 10 }
          ]
        },
        {
          type: 'TUTOR',
          questions: [
            { id: 1, text: 'Desempeño', maxScore: 10 },
            { id: 2, text: 'Conocimiento', maxScore: 10 }
          ]
        }
      ]);
    }

    if (!localStorage.getItem(this.evaluationsKey)) {
      this.save(this.evaluationsKey, []);
    }
  }
}
