import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { TrainerService } from './services/trainer.service';
import { GymService } from './services/gym.service';
import { BookingService } from './services/booking.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { NotificationService } from './services/notification.service'; 
import { NotificationsComponent } from './components/notifications/notifications.component';  
import { User } from './models/user.model';
import { Trainer } from './models/trainer.model';
import { Gym } from './models/gym.model';
import { Booking } from './models/booking.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  activeTab = 'trainers';
  isLoggedIn = false;
  currentUser: any = null;
  isDarkTheme = true;
  
  // 👇 Notification-ებისთვის
  showNotifications = false;
  unreadCount = 0;
  highlightBookingId: number | null = null;
  
  users: User[] = [];
  loadingUsers = true;
  usersError = '';
  
  trainers: Trainer[] = [];
  loadingTrainers = true;
  trainersError = '';
  
  gyms: Gym[] = [];
  loadingGyms = true;
  gymsError = '';
  
  bookings: Booking[] = [];
  loadingBookings = true;
  bookingsError = '';

  showAddUserForm = false;
  newUser: any = { firstName: '', lastName: '', email: '', phoneNumber: '', userType: 'Client', isActive: true };
  showEditUserForm = false;
  editUserData: any = { id: 0, firstName: '', lastName: '', email: '', phoneNumber: '', userType: 'Client', isActive: true };
  showAddTrainerForm = false;
  newTrainer: any = { firstName: '', lastName: '', email: '', phoneNumber: '', bio: '', specialization: '', experienceYears: 0, hourlyRate: 0, isVerified: false };
  showAddGymForm = false;
  mobileMenuOpen = false;
  newGym: any = { name: '', address: '', city: '', phoneNumber: '', openTime: '', closeTime: '', isActive: true };
  showEditGymForm = false;
  editGymData: any = { id: 0, name: '', address: '', city: '', phoneNumber: '', openTime: '', closeTime: '', isActive: true };

  constructor(
    private userService: UserService,
    private trainerService: TrainerService,
    private gymService: GymService,
    private bookingService: BookingService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    // Subscribe to auth state
    this.authService.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.currentUser = this.authService.getUser();

      if (status) {
        this.loadUsers();
        this.loadTrainers();
        this.loadGyms();
        this.updateActiveTabFromUrl();
        
        // 👇 დააკავშირე Notification Service
      }
    });
    
    // URL-ის ცვლილების მოსმენა
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.isLoggedIn) {
        this.updateActiveTabFromUrl();
      }
    });
    
    // Subscribe to theme state
    this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    
    // 👇 Subscribe to unread count
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }
  
  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
  }

  updateActiveTabFromUrl(): void {
  const url = this.router.url;
  console.log('🔄 Updating active tab from URL:', url);

  if (url.includes('/users')) {
    this.activeTab = 'users';
  } else if (url.includes('/gyms')) {
    this.activeTab = 'gyms';
  } else if (url.includes('/bookings')) {
    this.activeTab = 'bookings';
  } else if (url.includes('/booking-form')) {
    this.activeTab = 'booking-form';
  } else if (url.includes('/dashboard')) {
    this.activeTab = 'dashboard';
  } else if (url.includes('/profile')){
    this.activeTab = 'profile';
  } else {
    this.activeTab = 'trainers';
  }

  console.log('✅ Active tab set to:', this.activeTab);
  }

  // Theme Switcher მეთოდი
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  // 👇 Notification-ების მეთოდები
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  
  onNavigateToBookings(bookingId: number) {
    this.showNotifications = false;
    this.highlightBookingId = bookingId;
    this.changeTab('bookings');
    
    // 3 წამის შემდეგ მოხსენი highlight
    setTimeout(() => {
      this.highlightBookingId = null;
    }, 3000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (d) => { this.users = d; this.loadingUsers = false; },
      error: (e) => { this.usersError = e.message; this.loadingUsers = false; }
    });
  }

  loadTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (d) => { this.trainers = d; this.loadingTrainers = false; },
      error: (e) => { this.trainersError = e.message; this.loadingTrainers = false; }
    });
  }

  loadGyms() {
    this.gymService.getGyms().subscribe({
      next: (d) => { this.gyms = d; this.loadingGyms = false; },
      error: (e) => { this.gymsError = e.message; this.loadingGyms = false; }
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
    this.router.navigate([`/${tab}`]);
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
      next: (d) => {
        this.users.push(d);
        this.closeModals();
        alert('Client added!');
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }
  
  addTrainer() {
    if (
      !this.newTrainer.firstName ||
      !this.newTrainer.lastName ||
      !this.newTrainer.email ||
      !this.newTrainer.specialization ||
      !this.newTrainer.experienceYears ||
      !this.newTrainer.hourlyRate
    ) {
      alert('Please fill all required fields');
      return;
    }

    const userToCreate = {
      firstName: this.newTrainer.firstName,
      lastName: this.newTrainer.lastName,
      email: this.newTrainer.email,
      phoneNumber: this.newTrainer.phoneNumber || null,
      password: 'password123',
      userType: 'Trainer',
      isActive: true
    };

    this.userService.createUser(userToCreate).subscribe({
      next: (user) => {
        const trainerToCreate = {
          userId: user.id,
          bio: this.newTrainer.bio || null,
          specialization: this.newTrainer.specialization,
          experienceYears: Number(this.newTrainer.experienceYears),
          hourlyRate: Number(this.newTrainer.hourlyRate),
          rating: 0,
          isVerified: this.newTrainer.isVerified || false
        };

        this.trainerService.createTrainer(trainerToCreate).subscribe({
          next: () => {
            this.closeModals();
            this.loadTrainers();
            alert('Trainer added!');
          },
          error: (e) => {
            alert('Error: ' + (e.error?.message || e.message));
          }
        });
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  addGym() {
    if (
      !this.newGym.name ||
      !this.newGym.address ||
      !this.newGym.city ||
      !this.newGym.phoneNumber ||
      !this.newGym.openTime ||
      !this.newGym.closeTime
    ) {
      alert('Please fill all required fields');
      return;
    }

    const gymToCreate = {
      name: this.newGym.name,
      address: this.newGym.address,
      city: this.newGym.city,
      phoneNumber: this.newGym.phoneNumber,
      openTime: this.newGym.openTime + ':00',
      closeTime: this.newGym.closeTime + ':00',
      isActive: true
    };

    this.gymService.createGym(gymToCreate).subscribe({
      next: (d) => {
        this.gyms.push(d);
        this.closeModals();
        alert('Gym added!');
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  editUser(u: User) {
    this.editUserData = { ...u };
    this.showEditUserForm = true;
  }

  updateUser() {
    const userToUpdate = {
      id: this.editUserData.id,
      firstName: this.editUserData.firstName,
      lastName: this.editUserData.lastName,
      email: this.editUserData.email,
      phoneNumber: this.editUserData.phoneNumber,
      userType: this.editUserData.userType,
      isActive: this.editUserData.isActive
    };

    this.userService.updateUser(this.editUserData.id, userToUpdate).subscribe({
      next: () => {
        const idx = this.users.findIndex(u => u.id === this.editUserData.id);
        if (idx !== -1)
          this.users[idx] = { ...this.editUserData };

        this.closeModals();
        alert('User updated!');
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  editGym(g: Gym) {
    this.editGymData = { ...g };
    this.showEditGymForm = true;
  }

  updateGym() {
    const gymToUpdate = {
      id: this.editGymData.id,
      name: this.editGymData.name,
      address: this.editGymData.address,
      city: this.editGymData.city,
      phoneNumber: this.editGymData.phoneNumber,
      openTime: this.editGymData.openTime.includes(':00')
        ? this.editGymData.openTime
        : this.editGymData.openTime + ':00',
      closeTime: this.editGymData.closeTime.includes(':00')
        ? this.editGymData.closeTime
        : this.editGymData.closeTime + ':00',
      isActive: this.editGymData.isActive
    };

    this.gymService.updateGym(this.editGymData.id, gymToUpdate).subscribe({
      next: () => {
        const idx = this.gyms.findIndex(g => g.id === this.editGymData.id);
        if (idx !== -1)
          this.gyms[idx] = { ...this.editGymData };

        this.closeModals();
        alert('Gym updated!');
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Delete user?'))
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          alert('User deleted!');
        },
        error: (e) => {
          alert('Error: ' + (e.error?.message || e.message));
        }
      });
  }

  deleteGym(id: number) {
    if (confirm('Delete gym?'))
      this.gymService.deleteGym(id).subscribe({
        next: () => {
          this.gyms = this.gyms.filter(g => g.id !== id);
          alert('Gym deleted!');
        },
        error: (e) => {
          alert('Error: ' + (e.error?.message || e.message));
        }
      });
  }

  closeModals() {
    this.showAddUserForm = false;
    this.showEditUserForm = false;
    this.showAddTrainerForm = false;
    this.showAddGymForm = false;
    this.showEditGymForm = false;

    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      userType: 'Client',
      isActive: true
    };

    this.newTrainer = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      bio: '',
      specialization: '',
      experienceYears: 0,
      hourlyRate: 0,
      isVerified: false,
      gymId: null,
      workDays: '',
      workStart: '',
      workEnd: ''
    };

    this.newGym = {
      name: '',
      address: '',
      city: '',
      phoneNumber: '',
      openTime: '',
      closeTime: '',
      isActive: true
    };
  }

  getTrainerCount(): number { return this.users.filter(u => u.userType === 'Trainer').length; }

  getClientCount(): number { return this.users.filter(u => u.userType === 'Client').length; }

  getUserTypeClass(userType: string): string { return `${userType.toLowerCase()}-row`; }

  getBadgeClass(userType: string): string { return `badge-${userType.toLowerCase()}`; }

  get userRole(): string { return this.authService.getUserType(); }

  isAdmin(): boolean { return this.userRole === 'Admin'; }

  isTrainer(): boolean { return this.userRole === 'Trainer'; }

  isClient(): boolean { return this.userRole === 'Client'; }


  
}