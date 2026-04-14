import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-easy-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './easy-booking.component.html',
  styleUrls: ['./easy-booking.component.css']
})
export class EasyBookingComponent implements OnInit, AfterViewInit {
  @ViewChild('statsSection') statsSection!: ElementRef;
  
  statsAnimated = false;
  animatedElements: string[] = [];
  isSticky = false;
  isAtBottom = false;
  showBackButton = false;

  stats = {
    bookings: 0,
    time: 0,
    satisfaction: 0
  };

  constructor(private router: Router) {}

  ngOnInit() {
    // გვერდის ზევით გადახვევა
    window.scrollTo(0, 0);
    
    window.addEventListener('scroll', () => {
      this.checkStickyVisibility();
      this.checkBackButtonVisibility();
    });
    
    setTimeout(() => {
      this.animateStats();
    }, 500);
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    this.checkStickyVisibility();
    this.checkBackButtonVisibility();
    
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  // 👈 Back to Main Page
  goBackToMain() {
    this.router.navigate(['/']);
  }

  checkStickyVisibility() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const isNearBottom = scrollY + windowHeight >= documentHeight - 150;
    
    this.isAtBottom = isNearBottom;
    
    if (isNearBottom) {
      this.isSticky = false;
    } else {
      this.isSticky = scrollY > 300;
    }
  }

  // 👈 Back Button-ის ხილვადობა – ჩნდება Hero-ს ჩავლის შემდეგ
  checkBackButtonVisibility() {
    const heroSection = document.querySelector('.hero-section') as HTMLElement | null;
    if (heroSection) {
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      this.showBackButton = heroBottom < 100;
    } else {
      this.showBackButton = false;
    }
  }

  triggerScrollAnimations() {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('in-view');
    });
    
    document.querySelectorAll('.benefit-card').forEach((el, i) => {
      setTimeout(() => el.classList.add('animated'), i * 100);
    });
    
    document.querySelectorAll('.step').forEach((el, i) => {
      setTimeout(() => el.classList.add('animated'), i * 100);
    });
    
    document.querySelectorAll('.feature-item').forEach((el, i) => {
      setTimeout(() => el.classList.add('animated'), i * 100);
    });
    
    document.querySelectorAll('.pricing-card').forEach((el, i) => {
      setTimeout(() => el.classList.add('animated'), i * 150);
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.statsAnimated) {
          this.animateStats();
          this.statsAnimated = true;
        }
        
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.classList.add('in-view');
        } else {
          target.classList.remove('in-view');
          target.classList.add('scrolled-out');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  animateStats() {
    if (this.statsAnimated) return;
    this.statsAnimated = true;
    
    const duration = 2000;
    const step = 20;
    const bookingsTarget = 1000;
    const timeTarget = 30;
    const satisfactionTarget = 99;
    
    let currentBookings = 0;
    let currentTime = 0;
    let currentSatisfaction = 0;
    
    const interval = setInterval(() => {
      if (currentBookings < bookingsTarget) {
        currentBookings = Math.min(currentBookings + 50, bookingsTarget);
        this.stats.bookings = currentBookings;
      }
      if (currentTime < timeTarget) {
        currentTime = Math.min(currentTime + 2, timeTarget);
        this.stats.time = currentTime;
      }
      if (currentSatisfaction < satisfactionTarget) {
        currentSatisfaction = Math.min(currentSatisfaction + 5, satisfactionTarget);
        this.stats.satisfaction = currentSatisfaction;
      }
      
      if (currentBookings >= bookingsTarget && 
          currentTime >= timeTarget && 
          currentSatisfaction >= satisfactionTarget) {
        clearInterval(interval);
      }
    }, step);
  }

  bookNow() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/booking-form']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}