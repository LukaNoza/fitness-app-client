import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';   // ⬅️ დამატებულია
import { tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  // LOGIN STATE STREAM
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedInSubject.asObservable();

  private hasToken(): boolean {
    return localStorage.getItem('token') !== null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          userType: response.userType
        }));

        this.loggedInSubject.next(true);
      })
    );
  }

  register(user: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          userType: response.userType
        }));

        this.loggedInSubject.next(true); 
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.loggedInSubject.next(false);  
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserType(): string {
    return this.getUser()?.userType || '';
  }

  isAdmin(): boolean {
    return this.getUserType() === 'Admin';
  }

  isTrainer(): boolean {
    return this.getUserType() === 'Trainer';
  }

  isClient(): boolean {
    return this.getUserType() === 'Client';
  }
}