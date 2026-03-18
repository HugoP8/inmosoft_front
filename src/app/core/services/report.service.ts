import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/reports`;

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard`);
  }

  getSalesReport(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, String(v)); });
    return this.http.get<any>(`${this.baseUrl}/sales`, { params });
  }

  getLeadsReport(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, String(v)); });
    return this.http.get<any>(`${this.baseUrl}/leads`, { params });
  }

  getPropertiesReport(filters: any = {}): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/properties`);
  }

  getAgentsReport(filters: any = {}): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/agents`);
  }
}
