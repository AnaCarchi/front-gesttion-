import { Injectable } from '@angular/core';
import { Internship } from '../models';
import { STORAGE_KEYS } from '../models/constants';

@Injectable({ providedIn: 'root' })
export class InternshipService {

  private key = STORAGE_KEYS.INTERNSHIPS;

  constructor() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  private read(): Internship[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  private save(data: Internship[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  getByAssignment(assignmentId: number): Internship[] {
    return this.read().filter(i => i.trainingAssignmentId === assignmentId);
  }

  create(internship: Internship): Internship {
    const data = this.read();

    const newInternship: Internship = {
      ...internship,
      id: Date.now()
    };

    data.push(newInternship);
    this.save(data);

    return newInternship;
  }
}
