import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tutors`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(tutor: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, tutor);
  }

  update(id: number, tutor: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, tutor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
