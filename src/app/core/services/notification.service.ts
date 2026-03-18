import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification, PaginatedResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/notifications`;

  private _unreadCount$ = new BehaviorSubject<number>(0);
  unreadCount$ = this._unreadCount$.asObservable();

  getAll(): Observable<PaginatedResponse<Notification>> {
    return this.http.get<PaginatedResponse<Notification>>(this.baseUrl);
  }

  getUnread(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/unread`).pipe(
      tap(items => this._unreadCount$.next(items.length))
    );
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.baseUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const current = this._unreadCount$.value;
        this._unreadCount$.next(Math.max(0, current - 1));
      })
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/read-all`, {}).pipe(
      tap(() => this._unreadCount$.next(0))
    );
  }
}
