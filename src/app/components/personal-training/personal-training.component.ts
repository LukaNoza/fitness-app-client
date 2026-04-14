import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personal-training',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './personal-training.component.html',
  styleUrls: ['./personal-training.component.css']
})
export class PersonalTrainingComponent implements OnInit, AfterViewInit {
  currentTestimonial = 0;
  isSticky = false;
  isAtBottom = false;
  statsAnimated = false;

  // 👇 სტატის ობიექტი (როგორც Easy Booking-ში)
  stats = {
    happyClients: 0,
    expertTrainers: 0,
    sessionsCompleted: 0
  };

  testimonials = [
    { text: "Working with Giorgi changed my life! Lost 15kg in 3 months and gained so much confidence.", author: "Lasha Gelashvili", rating: 5 },
    { text: "Best decision ever! The personalized plan and constant motivation kept me going.", author: "Nana Hayha", rating: 5 },
    { text: "Professional trainers, great atmosphere, amazing results. Highly recommend!", author: "Teona Chanturia", rating: 5 }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    
    window.addEventListener('scroll', () => {
      this.checkStickyVisibility();
    });
    
    setTimeout(() => {
      this.animateStats();
    }, 800);
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    this.checkStickyVisibility();
    
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  // 👇 Count-up ანიმაცია (როგორც Easy Booking-ში)
  animateStats() {
    if (this.statsAnimated) return;
    this.statsAnimated = true;
    
    const happyClientsTarget = 500;
    const expertTrainersTarget = 50;
    const sessionsTarget = 1000;
    
    let currentHappy = 0;
    let currentTrainers = 0;
    let currentSessions = 0;
    
    const duration = 2000;
    const step = 20;
    const happyStep = happyClientsTarget / (duration / step);
    const trainersStep = expertTrainersTarget / (duration / step);
    const sessionsStep = sessionsTarget / (duration / step);
    
    const interval = setInterval(() => {
      currentHappy = Math.min(currentHappy + happyStep, happyClientsTarget);
      currentTrainers = Math.min(currentTrainers + trainersStep, expertTrainersTarget);
      currentSessions = Math.min(currentSessions + sessionsStep, sessionsTarget);
      
      this.stats.happyClients = Math.floor(currentHappy);
      this.stats.expertTrainers = Math.floor(currentTrainers);
      this.stats.sessionsCompleted = Math.floor(currentSessions);
      
      if (currentHappy >= happyClientsTarget && 
          currentTrainers >= expertTrainersTarget && 
          currentSessions >= sessionsTarget) {
        clearInterval(interval);
      }
    }, step);
  }

  checkStickyVisibility() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    const isNearBottom = scrollY + windowHeight >= documentHeight - 200;
    
    this.isAtBottom = isNearBottom;
    
    if (isNearBottom) {
      this.isSticky = false;
    } else {
      this.isSticky = scrollY > 300;
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          target.classList.add('in-view');
        } else {
          target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  goBackToMain() {
    this.router.navigate(['/']);
  }

  bookNow() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/booking-form']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  viewTrainer(trainerId: number) {
    this.router.navigate(['/trainers']);
  }

  prevTestimonial() {
    this.currentTestimonial = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length;
  }

  nextTestimonial() {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  goToTestimonial(index: number) {
    this.currentTestimonial = index;
  }
}