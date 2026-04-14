import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';
  
  showAddUserForm = false;
  newUser: any = { firstName: '', lastName: '', email: '', phoneNumber: '', userType: 'Client', isActive: true };
  
  showEditUserForm = false;
  editUserData: any = { id: 0, firstName: '', lastName: '', email: '', phoneNumber: '', userType: 'Client', isActive: true };

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  addUser() {
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.email) {
      alert('Please fill all required fields');
      return;
    }

    const userToCreate = {
      firstName: this.newUser.firstName,
      lastName: this.newUser.lastName,
      email: this.newUser.email,
      phoneNumber: this.newUser.phoneNumber,
      userType: 'Client',
      isActive: true
    };

    this.userService.createUser(userToCreate).subscribe({
      next: (user) => {
        this.users.push(user);
        this.closeModals();
        alert('Client added successfully!');
        this.loadUsers(); // განაახლე სია
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  editUser(user: User) {
    this.editUserData = { ...user };
    this.showEditUserForm = true;
  }

  updateUser() {
    this.userService.updateUser(this.editUserData.id, this.editUserData).subscribe({
      next: () => {
        const index = this.users.findIndex(u => u.id === this.editUserData.id);
        if (index !== -1) {
          this.users[index] = { ...this.editUserData };
        }
        this.closeModals();
        alert('User updated successfully!');
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          alert('User deleted successfully!');
        },
        error: (e) => {
          alert('Error: ' + (e.error?.message || e.message));
        }
      });
    }
  }

  closeModals() {
    this.showAddUserForm = false;
    this.showEditUserForm = false;
    
    // Reset forms
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userType: 'Client',
      isActive: true
    };
    
    this.editUserData = {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userType: 'Client',
      isActive: true
    };
  }

  getTrainerCount(): number {
    return this.users.filter(u => u.userType === 'Trainer').length;
  }

  getClientCount(): number {
    return this.users.filter(u => u.userType === 'Client').length;
  }

  getBadgeClass(userType: string): string {
    return `badge-${userType.toLowerCase()}`;
  }
}