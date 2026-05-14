

import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UsersComponent } from './components/users/users.component';
import { TrainersComponent } from './components/trainers/trainers.component';
import { GymsComponent } from './components/gyms/gyms.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LandingComponent } from './components/landing/landing.component';
import { InfoComponent } from './components/info/info.component';
import { PersonalTrainingComponent } from './components/personal-training/personal-training.component';
import { EasyBookingComponent } from './components/easy-booking/easy-booking.component';




export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'personal-training', component: PersonalTrainingComponent },
  { path: 'easy-booking', component: EasyBookingComponent },
  { path: 'info/:topic', component: InfoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Admin' } },
  { path: 'trainers', component: TrainersComponent, canActivate: [AuthGuard] },
  { path: 'gyms', component: GymsComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'booking-form', component: BookingFormComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    {
    path: '',
    loadComponent: () => import('./components/landing/landing.component')
      .then(m => m.LandingComponent)  
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },
];