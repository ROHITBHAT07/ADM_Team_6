import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthResponse, User } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUser: User | null = null;
  private authStateChanged = new BehaviorSubject<boolean>(false);

  authState$ = this.authStateChanged.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
    this.authStateChanged.next(this.isAuthenticated());
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      this.http
        .post<AuthResponse>(`${this.apiUrl}/authenticate`, credentials)
        .subscribe({
          next: (response) => {
            if (response && response.accessToken) {
              localStorage.setItem('token', response.accessToken);
              this.loadCurrentUser();
              this.authStateChanged.next(true);
            }
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  register(userData: {
    email: string;
    password: string;
    fullName: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/forgot-password?email=${email}`,
      {}
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {
      token,
      newPassword,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
    this.authStateChanged.next(false);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        this.currentUser = jwtDecode<User>(token);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.currentUser = null;
      }
    }
  }
}
