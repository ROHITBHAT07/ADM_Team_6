import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <nav *ngIf="isLoggedIn" class="main-nav">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
        <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active"
          >Admin</a
        >
        <button (click)="logout()">Logout</button>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    // You would typically decode the JWT token to check the role
    // This is a simplified example
    const user = this.authService.getCurrentUser();
    this.isAdmin = user?.role === 'ADMIN';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
