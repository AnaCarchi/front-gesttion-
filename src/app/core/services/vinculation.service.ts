import { Injectable } from '@angular/core';
import { Vinculation } from '../models';

@Injectable({ providedIn: 'root' })
export class VinculationService {

  private readonly key = 'vinculations';

  constructor() {
    // Inicializa storage si no existe
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  // ===========================
  // LECTURA
  // ===========================

  private read(): Vinculation[] {
    try {
      return JSON.parse(localStorage.getItem(this.key) || '[]');
    } catch {
      return [];
    }
  }

  private save(data: Vinculation[]): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  // ===========================
  // CONSULTAS
  // ===========================

  getByAssignment(assignmentId: number): Vinculation | undefined {
    return this.read().find(v => v.trainingAssignmentId === assignmentId);
  }

  getAll(): Vinculation[] {
    return this.read();
  }

  // ===========================
  // CREACIÓN
  // ===========================

  create(vinculation: Vinculation): Vinculation {
    const data = this.read();

    const newVinculation: Vinculation = {
      ...vinculation,
      id: vinculation.id && vinculation.id !== 0 ? vinculation.id : Date.now()
    };

    data.push(newVinculation);
    this.save(data);
    return newVinculation;
  }

  // ===========================
  // ACTUALIZACIÓN
  // ===========================

  update(vinculation: Vinculation): void {
    const updated = this.read().map(v =>
      v.id === vinculation.id ? vinculation : v
    );

    this.save(updated);
  }

  // ===========================
  // ELIMINACIÓN
  // ===========================

  delete(id: number): void {
    const filtered = this.read().filter(v => v.id !== id);
    this.save(filtered);
  }
}
