import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a routerLink="/register">Register here</a></p>
    </div>
  `,
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  get credentials() {
    return {
      email: this.email,
      password: this.password,
    };
  }

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('Attempting login with:', this.credentials);

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login response received:', response);

        if (response && response.accessToken) {
          console.log('Token received, setting in localStorage');
          localStorage.setItem('token', response.accessToken);
          console.log('Navigating to dashboard...');

          this.router
            .navigate(['/dashboard'])
            .then(() => {
              console.log('Navigation complete');
            })
            .catch((err) => {
              console.error('Navigation failed:', err);
            });
        } else {
          console.warn('No token in response:', response);
          alert('Login successful but no token received');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error.error?.message === 'User is disabled') {
          alert(
            'Please verify your email before logging in. Check your inbox for the verification link.'
          );
        } else {
          alert('Login failed. Please check your credentials.');
        }
      },
      complete: () => {
        console.log('Login request completed');
      },
    });
  }
}
