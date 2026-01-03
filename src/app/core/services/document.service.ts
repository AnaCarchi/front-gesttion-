import { Injectable } from '@angular/core';
import { DocumentFile } from '../models';
import { STORAGE_KEYS } from '../models/constants';

@Injectable({ providedIn: 'root' })
export class DocumentService {

  private key = STORAGE_KEYS.DOCUMENTS;

  constructor() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  private read(): DocumentFile[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  private save(data: DocumentFile[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  getByAssignment(assignmentId: number): DocumentFile[] {
    return this.read().filter(d => d.trainingAssignmentId === assignmentId);
  }

  upload(doc: DocumentFile): void {
    const data = this.read();

    const newDoc: DocumentFile = {
      ...doc,
      id: Date.now(),
      uploadedAt: new Date().toISOString()
    };

    data.push(newDoc);
    this.save(data);
  }
}
