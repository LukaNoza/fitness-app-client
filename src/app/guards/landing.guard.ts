// guards/landing.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LandingGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // თუ მომხმარებელი ლოგინებულია, გადავამისამართოთ ტრენერების გვერდზე
    if (this.authService.isLoggedIn()) {
      const userType = this.authService.getUserType();
      if (userType === 'Admin') {
        this.router.navigate(['/users']);
      } else {
        this.router.navigate(['/trainers']);
      }
      return false;
    }
    return true;
  }
}