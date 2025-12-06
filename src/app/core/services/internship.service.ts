import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Internship } from '../models';

export type InternshipStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/internships`;

  getAll(): Observable<Internship[]> {
    return this.http.get<Internship[]>(this.apiUrl);
  }

  getById(id: number): Observable<Internship> {
    return this.http.get<Internship>(`${this.apiUrl}/${id}`);
  }

  create(internship: Internship): Observable<Internship> {
    return this.http.post<Internship>(this.apiUrl, internship);
  }

  update(id: number, internship: Internship): Observable<Internship> {
    return this.http.put<Internship>(`${this.apiUrl}/${id}`, internship);
  }

  updateStatus(id: number, status: string): Observable<Internship> {
    return this.http.patch<Internship>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateDocuments(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/documents`, {
      responseType: 'blob'
    });
  }
}
