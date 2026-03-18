import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Property, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/properties`;

  getAll(filters: any = {}): Observable<PaginatedResponse<Property>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Property>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Property>): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Property>): Observable<Property> {
    return this.http.patch<Property>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
