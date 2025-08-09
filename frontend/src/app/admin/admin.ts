import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../types/auth.types';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <h2>Admin Dashboard</h2>

      <div class="admin-section">
        <h3>User Management</h3>
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search users..."
            [(ngModel)]="searchTerm"
          />
          <select [(ngModel)]="filterRole">
            <option value="">All Roles</option>
            <option value="DOCTOR">Doctors</option>
            <option value="PATIENT">Patients</option>
          </select>
        </div>

        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td class="actions">
                <button class="edit-btn" (click)="editUser(user)">Edit</button>
                <button class="delete-btn" (click)="deleteUser(user)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="admin-section">
        <h3>Create New User</h3>
        <form (ngSubmit)="createUser()" #createUserForm="ngForm">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              [(ngModel)]="newUser.firstName"
              required
            />
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              [(ngModel)]="newUser.lastName"
              required
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="newUser.email"
              required
            />
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" name="role" [(ngModel)]="newUser.role" required>
              <option value="DOCTOR">Doctor</option>
              <option value="PATIENT">Patient</option>
            </select>
          </div>
          <button type="submit">Create User</button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  filterRole = '';

  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'PATIENT',
  };

  get filteredUsers() {
    return this.users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.filterRole || user.role === this.filterRole;

      return matchesSearch && matchesRole;
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // TODO: Implement user loading from backend
  }

  createUser() {
    // TODO: Implement user creation
  }

  editUser(user: User) {
    // TODO: Implement user editing
  }

  deleteUser(user: User) {
    // TODO: Implement user deletion
  }
}
