import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private storageKey = 'students';

  constructor() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  getAll(): Student[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  getById(id: number): Student | undefined {
    return this.getAll().find(s => s.id === id);
  }

  getByUserId(userId: number): Student | undefined {
    return this.getAll().find(s => s.userId === userId);
  }

  create(student: Student): Student {
    const students = this.getAll();
    student.id = Date.now();
    students.push(student);
    localStorage.setItem(this.storageKey, JSON.stringify(students));
    return student;
  }

  update(student: Student): void {
    const updated = this.getAll().map(s =>
      s.id === student.id ? student : s
    );
    localStorage.setItem(this.storageKey, JSON.stringify(updated));
  }

  delete(id: number): void {
    const filtered = this.getAll().filter(s => s.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }
}
