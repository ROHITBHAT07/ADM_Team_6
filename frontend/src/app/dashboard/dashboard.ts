import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { User } from '../types/auth.types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h2>Welcome, {{ user?.firstName }}!</h2>
      <div class="dashboard-content">
        <div class="role-specific-content" *ngIf="user">
          <ng-container [ngSwitch]="user.role">
            <div *ngSwitchCase="'ADMIN'" class="admin-dashboard">
              <h3>Admin Dashboard</h3>
              <div class="stats-grid">
                <div class="stat-card">
                  <h4>Total Users</h4>
                  <p class="stat">{{ stats.totalUsers || 0 }}</p>
                </div>
                <div class="stat-card">
                  <h4>Total Doctors</h4>
                  <p class="stat">{{ stats.totalDoctors || 0 }}</p>
                </div>
                <div class="stat-card">
                  <h4>Total Patients</h4>
                  <p class="stat">{{ stats.totalPatients || 0 }}</p>
                </div>
              </div>
            </div>

            <div *ngSwitchCase="'DOCTOR'" class="doctor-dashboard">
              <h3>Doctor Dashboard</h3>
              <div class="appointments-section">
                <h4>Today's Appointments</h4>
                <!-- Add appointment list here -->
              </div>
            </div>

            <div *ngSwitchCase="'PATIENT'" class="patient-dashboard">
              <h3>Patient Dashboard</h3>
              <div class="appointments-section">
                <h4>Your Upcoming Appointments</h4>
                <!-- Add appointment list here -->
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  stats = {
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    // Here you would typically fetch statistics and other data
    // based on the user's role
  }
}
