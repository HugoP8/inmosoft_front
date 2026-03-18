import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead, LeadStatus, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/leads`;

  getAll(filters: any = {}): Observable<PaginatedResponse<Lead>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Lead>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Lead>): Observable<Lead> {
    return this.http.post<Lead>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Lead>): Observable<Lead> {
    return this.http.patch<Lead>(`${this.baseUrl}/${id}`, data);
  }

  updateStatus(id: string, status: LeadStatus): Observable<Lead> {
    return this.http.patch<Lead>(`${this.baseUrl}/${id}/status`, { status });
  }

  assignLead(id: string, userId: string): Observable<Lead> {
    return this.http.patch<Lead>(`${this.baseUrl}/${id}/assign`, { userId });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
