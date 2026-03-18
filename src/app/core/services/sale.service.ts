import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sale, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class SaleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/sales`;

  getAll(filters: any = {}): Observable<PaginatedResponse<Sale>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== null && v !== undefined && v !== '') params = params.set(k, String(v)); });
    return this.http.get<PaginatedResponse<Sale>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.baseUrl}/${id}`);
  }

  create(data: any): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, data);
  }

  close(id: string): Observable<Sale> {
    return this.http.patch<Sale>(`${this.baseUrl}/${id}/close`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
