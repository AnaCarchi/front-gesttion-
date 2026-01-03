import { Injectable } from '@angular/core';
import { Enterprise } from '../models';
import { STORAGE_KEYS } from '../models/constants';

@Injectable({ providedIn: 'root' })
export class EnterpriseService {

  private key = STORAGE_KEYS.ENTERPRISES;

  constructor() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
  }

  private read(): Enterprise[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  private save(data: Enterprise[]) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  getAll(): Enterprise[] {
    return this.read();
  }

  getByIds(ids: number[]): Enterprise[] {
    return this.read().filter(e => ids.includes(e.id));
  }

  getById(id: number): Enterprise | undefined {
    return this.read().find(e => e.id === id);
  }

  create(company: Enterprise): Enterprise {
    const data = this.read();
    company.id = Date.now();
    data.push(company);
    this.save(data);
    return company;
  }
}
