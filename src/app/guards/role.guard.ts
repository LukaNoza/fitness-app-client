import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const userRole = this.authService.getUserType();
    
    // თუ როლი არ არის მითითებული, ყველას უშვებს
    if (!requiredRole) return true;
    
    // Admin-ს ყველაფერზე აქვს წვდომა
    if (userRole === 'Admin') return true;
    
    // სხვა შემთხვევაში მხოლოდ საჭირო როლს უშვებს
    if (userRole === requiredRole) return true;
    
    this.router.navigate(['/']);
    return false;
  }
}