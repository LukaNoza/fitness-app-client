import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(private router: Router) {}

  getStarted(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/trainers']);
    } else {
      this.router.navigate(['/register']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToAbout(): void {
    this.router.navigate(['/about']);
  }

  goToClasses(): void {
    this.router.navigate(['/classes']);
  }

  goToYogaClass(): void {
    this.router.navigate(['/yogaClass']);
  }

  goToSchedule(): void {
    this.router.navigate(['/schedule']);
  }

  goToBlog(): void {
    this.router.navigate(['/blog']);
  }

  // Extra cards navigation
  goToPersonalTraining(): void {
    this.router.navigate(['/personal-training']);
  }

  goToLiveChat(): void {
    this.router.navigate(['/info/live-chat']);
  }

  goToEasyBooking(): void {
    this.router.navigate(['/easy-booking']);
  }
}