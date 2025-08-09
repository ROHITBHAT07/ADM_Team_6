import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../types/auth.types';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <h2>My Profile</h2>

      <div class="profile-section">
        <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              [(ngModel)]="userData.firstName"
              required
            />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              [(ngModel)]="userData.lastName"
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
              readonly
            />
          </div>

          <div class="form-group">
            <label for="role">Role</label>
            <input type="text" id="role" [value]="userData.role" readonly />
          </div>

          <button type="submit">Update Profile</button>
        </form>
      </div>

      <div class="profile-section">
        <h3>Change Password</h3>
        <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              [(ngModel)]="passwordData.currentPassword"
              required
            />
          </div>

          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              [(ngModel)]="passwordData.newPassword"
              required
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="passwordData.confirmPassword"
              required
            />
          </div>

          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  userData: User = {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    role: 'PATIENT',
  };
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userData = { ...currentUser };
    }
  }

  updateProfile() {
    // TODO: Implement profile update
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    // TODO: Implement password change
  }
}
