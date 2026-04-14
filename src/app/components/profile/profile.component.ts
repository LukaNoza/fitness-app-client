import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  };
  
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  loading = false;
  message = '';
  messageType = '';
  
  // Show Password toggles
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.userService.getUser(currentUser.id).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          this.message = 'Error loading profile';
          this.messageType = 'error';
        }
      });
    }
  }

  onSubmit() {
    if (!this.user.firstName || !this.user.lastName || !this.user.email) {
      this.message = 'Please fill all required fields';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.message = '';

    // Update user profile
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.message = '✅ Profile updated successfully!';
        this.messageType = 'success';
        this.loading = false;
        
        // Update local storage
        const currentUser = this.authService.getUser();
        if (currentUser) {
          currentUser.firstName = this.user.firstName;
          currentUser.lastName = this.user.lastName;
          currentUser.email = this.user.email;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        // Change password if provided
        if (this.passwordData.newPassword) {
          this.changePassword();
        } else {
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      },
      error: (err) => {
        this.message = err.error?.message || 'Error updating profile';
        this.messageType = 'error';
        this.loading = false;
      }
    });
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.message = 'New passwords do not match';
      this.messageType = 'error';
      this.loading = false;
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.message = 'Password must be at least 6 characters';
      this.messageType = 'error';
      this.loading = false;
      return;
    }

    // TODO: Implement password change API
    // this.userService.changePassword(this.user.id, this.passwordData).subscribe({...});
    
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  uploadAvatar() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // TODO: Implement avatar upload
      console.log('Selected file:', file.name);
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  // Toggle password visibility
  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}