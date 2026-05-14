import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements AfterViewInit {

  // DATA (my existing data)
  
  features = [
    { icon: '🏋️', title: 'Personal Training', tag: 'Certified', description: 'Get one-on-one training sessions with expert fitness coaches tailored to your goals.' },
    { icon: '💬', title: 'Live Chat', tag: 'Real-time', description: 'Communicate with your trainer in real-time, ask questions, and get instant feedback.' },
    { icon: '📅', title: 'Easy Booking', tag: 'Instant', description: 'Schedule your sessions at your convenience with our simple booking system.' },
    { icon: '📋', title: 'Custom Workouts', tag: 'AI-Powered', description: 'AI-powered workout plans that adapt to your progress and preferences.' },
    { icon: '🥗', title: 'Nutrition Plans', tag: 'Personalized', description: 'Personalized meal plans designed to fuel your workouts and maximize results.' },
    { icon: '🏆', title: 'Progress Tracking', tag: 'Analytics', description: 'Monitor your achievements with detailed analytics and milestone celebrations.' }
  ];

  steps = [
    { number: '01', title: 'Sign Up', description: 'Create your free account in under a minute.' },
    { number: '02', title: 'Choose Trainer', description: 'Browse profiles and select your perfect match.' },
    { number: '03', title: 'Book Session', description: 'Schedule your training at a time that suits you.' },
    { number: '04', title: 'Get Fit!', description: 'Start your transformation journey today.' }
  ];

  testimonials = [
    { name: 'Jessica Martinez', role: 'Lost 45 lbs in 6 months', content: 'FORGE completely changed my relationship with fitness. The personalized approach and constant support from my trainer made all the difference.', rating: 5, initials: 'JM' },
    { name: 'Michael Thompson', role: 'Gained 20 lbs muscle', content: 'The custom workout plans and nutrition guidance helped me build the physique I always wanted.', rating: 5, initials: 'MT' },
    { name: 'Sarah Kim', role: 'Marathon runner', content: 'From barely being able to run a mile to completing my first marathon. The trainers at FORGE pushed me beyond what I thought was possible.', rating: 5, initials: 'SK' }
  ];

  trainers = [
    { name: 'Marcus Johnson', specialty: 'Strength & Conditioning', experience: '10+ years', rating: 4.9, clients: 500, initials: 'MJ', certified: ['NASM', 'CSCS'] },
    { name: 'Sarah Chen', specialty: 'HIIT & Fat Loss', experience: '8+ years', rating: 5.0, clients: 420, initials: 'SC', certified: ['ACE', 'Precision Nutrition'] },
    { name: 'David Miller', specialty: 'Nutrition & Wellness', experience: '12+ years', rating: 4.9, clients: 650, initials: 'DM', certified: ['RD', 'ISSN'] },
    { name: 'Emma Wilson', specialty: 'Yoga & Mobility', experience: '6+ years', rating: 5.0, clients: 380, initials: 'EW', certified: ['RYT-500', 'FMS'] }
  ];

  plans = [
    { name: 'Starter', description: 'Perfect for beginners', monthlyPrice: 19, yearlyPrice: 15, features: ['50+ Workout Programs', 'Basic Nutrition Guide', 'Progress Tracking', 'Community Access'], popular: false },
    { name: 'Pro', description: 'Most popular choice', monthlyPrice: 39, yearlyPrice: 29, features: ['Everything in Starter', '200+ Premium Workouts', 'Personalized Meal Plans', 'Live Training Sessions', '1-on-1 Coaching (2x/mo)', 'AI Coach Access'], popular: true },
    { name: 'Elite', description: 'Ultimate package', monthlyPrice: 79, yearlyPrice: 59, features: ['Everything in Pro', 'Unlimited 1-on-1 Coaching', 'Custom Workout Creation', 'Advanced Analytics', 'VIP Community Access'], popular: false }
  ];

  faqs = [
    { question: 'How does the free trial work?', answer: 'Your 7-day free trial gives you full access to all FORGE features, including personal training sessions, workout plans, nutrition guidance, and community access. No credit card required to start.' },
    { question: 'Can I switch trainers if needed?', answer: 'Absolutely! You can request a new trainer at any time through your account settings, and we\'ll pair you with someone who better fits your needs and goals.' },
    { question: 'What equipment do I need?', answer: 'Our trainers can create customized workout plans based on your available equipment. Whether you have a full home gym, basic dumbbells, or no equipment at all, we\'ll design effective workouts for you.' },
    { question: 'How are the nutrition plans personalized?', answer: 'Our certified nutritionists create meal plans based on your dietary preferences, allergies, fitness goals, and lifestyle. Plans are adjusted as you progress and can accommodate any diet type.' },
    { question: 'Can I cancel my subscription anytime?', answer: 'Yes, you can cancel your subscription at any time with no hidden fees or penalties. Your access continues until the end of your current billing period.' }
  ];

  isYearly = true;
  openFaqIndex: number | null = 0;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  private setupScrollAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-up, .fade-in, .zoom-in, .stagger-item, .slide-left, .slide-right').forEach((el) => {
      observer.observe(el);
    });
  }

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

  goToPersonalTraining(): void {
    this.router.navigate(['/personal-training']);
  }

  goToLiveChat(): void {
    this.router.navigate(['/info/live-chat']);
  }

  goToEasyBooking(): void {
    this.router.navigate(['/easy-booking']);
  }

  togglePricing(): void {
    this.isYearly = !this.isYearly;
  }

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}