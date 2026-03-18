import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private _currentUser$ = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this._currentUser$.asObservable();

  private getUserFromStorage(): User | null {
    const raw = localStorage.getItem('current_user');
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getCurrentUser(): User | null {
    return this._currentUser$.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => this.storeSession(res))
    );
  }

  register(data: { tenantName: string; firstName: string; lastName: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => this.storeSession(res))
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this._currentUser$.next(null);
    this.router.navigate(['/auth/login']);
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('current_user', JSON.stringify(res.user));
    this._currentUser$.next(res.user);
  }
}
