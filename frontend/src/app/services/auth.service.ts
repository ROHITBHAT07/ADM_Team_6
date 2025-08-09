import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, User } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/authenticate`,
      credentials
    );
  }

  register(userData: {
    email: string;
    password: string;
    fullName: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
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
