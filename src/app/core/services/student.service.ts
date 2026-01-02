import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Student, StudentFilter, User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private storageKey = 'students';

  // ================= CRUD =================

  getAll(filter?: StudentFilter): Observable<Student[]> {
    let students = this.read();

    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null) {
          students = students.filter(
            s => (s as any)[key] == value
          );
        }
      });
    }

    return of(students).pipe(delay(300));
  }

  getById(id: number): Observable<Student> {
    const student = this.read().find(s => s.id === id);
    return of(student!).pipe(delay(300));
  }

  getByCareer(careerId: number): Observable<Student[]> {
    return of(
      this.read().filter(s => s.career?.id === careerId)
    ).pipe(delay(300));
  }

  getBySubjectType(subjectType: string): Observable<Student[]> {
    return of(
      this.read().filter(s => s.subjectType === subjectType)
    ).pipe(delay(300));
  }

  // ================= RELACIONES =================

  assignTutor(studentId: number, tutorId: number): Observable<any> {
    const students = this.read();
    const index = students.findIndex(s => s.id === studentId);

    if (index !== -1) {
      students[index].tutor = { id: tutorId } as User;
      this.save(students);
    }

    return of({ message: 'Tutor asignado' }).pipe(delay(300));
  }

  getMyStudents(): Observable<Student[]> {
    // Simula tutor logueado (puedes cambiarlo)
    const tutorId = Number(localStorage.getItem('tutorId')) || 1;

    return of(
      this.read().filter(s => s.tutor?.id === tutorId)
    ).pipe(delay(300));
  }

  // ================= BULK =================

  bulkCreate(students: Student[]): Observable<any> {
    const current = this.read();

    students.forEach(s => {
      s.id = Date.now() + Math.random();
      current.push(s);
    });

    this.save(current);

    return of({
      message: 'Estudiantes cargados correctamente'
    }).pipe(delay(500));
  }

  // ================= STORAGE =================

  private read(): Student[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private save(data: Student[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
