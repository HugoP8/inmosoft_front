import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/clients`;

  getAll(filters: any = {}): Observable<PaginatedResponse<Client>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Client>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Client>): Observable<Client> {
    return this.http.patch<Client>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
