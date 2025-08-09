import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../types/auth.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  createUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/users`, userData);
  }

  updateUser(id: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/admin/users/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }

  updateProfile(userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/profile`, userData);
  }

  changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/users/change-password`,
      passwordData
    );
  }
}
