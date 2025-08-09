import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            [(ngModel)]="userData.fullName"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="userData.email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="userData.password"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a routerLink="/login">Login here</a></p>
    </div>
  `,
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  userData = {
    fullName: '',
    email: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.userData).subscribe({
      next: (response) => {
        // Remove token storage and show verification message
        alert(
          'Registration successful! Please check your email to verify your account before logging in.'
        );
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      },
    });
  }
}
