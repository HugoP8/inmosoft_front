import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PipelineStage } from '../models';

@Injectable({ providedIn: 'root' })
export class PipelineService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/pipeline`;

  getStages(): Observable<PipelineStage[]> {
    return this.http.get<PipelineStage[]>(`${this.baseUrl}/stages`);
  }

  createStage(data: Partial<PipelineStage>): Observable<PipelineStage> {
    return this.http.post<PipelineStage>(`${this.baseUrl}/stages`, data);
  }

  updateStage(id: string, data: Partial<PipelineStage>): Observable<PipelineStage> {
    return this.http.patch<PipelineStage>(`${this.baseUrl}/stages/${id}`, data);
  }

  deleteStage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/stages/${id}`);
  }

  reorderStages(stages: { id: string; order: number }[]): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/stages/reorder`, { stages });
  }
}
