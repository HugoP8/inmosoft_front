import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Visit, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class VisitService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/visits`;

  getAll(filters: any = {}): Observable<PaginatedResponse<Visit>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Visit>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Visit> {
    return this.http.get<Visit>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<Visit> {
    return this.http.post<Visit>(this.baseUrl, data);
  }

  complete(id: string, data: { notes?: string; feedback?: string }): Observable<Visit> {
    return this.http.patch<Visit>(`${this.baseUrl}/${id}/complete`, data);
  }

  cancel(id: string): Observable<Visit> {
    return this.http.patch<Visit>(`${this.baseUrl}/${id}/cancel`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
