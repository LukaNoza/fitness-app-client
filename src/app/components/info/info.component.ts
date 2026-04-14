import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  topic: string = '';
  
  topics: any = {
    'easy-booking': {
      title: '📅 Easy Booking',
      icon: '📅',
      color: 'linear-gradient(135deg, #03a9f4, #ff0058)',
      description: 'Our easy booking system allows you to schedule training sessions at your convenience, anytime, anywhere.',
      longDescription: `
        <h3>What is Easy Booking?</h3>
        <p>Our easy booking system is designed to make scheduling your fitness sessions simple, fast, and hassle-free. No more phone calls, emails, or complicated processes.</p>
        
        <h3>How It Works</h3>
        <ul>
          <li><strong>1. Browse Trainers</strong> – Explore our list of certified professional trainers</li>
          <li><strong>2. Check Availability</strong> – See real-time availability of your chosen trainer</li>
          <li><strong>3. Select Date & Time</strong> – Choose a time that works for you</li>
          <li><strong>4. Confirm Booking</strong> – Your session is instantly confirmed</li>
          <li><strong>5. Show Up & Train</strong> – Meet your trainer and start your journey</li>
        </ul>
        
        <h3>Features</h3>
        <ul>
          <li><strong>✓ Real-time Availability</strong> – See open slots instantly</li>
          <li><strong>✓ Instant Confirmation</strong> – No waiting for approval</li>
          <li><strong>✓ Easy Rescheduling</strong> – Change your schedule with one click</li>
          <li><strong>✓ Automatic Reminders</strong> – Never miss a session</li>
          <li><strong>✓ Booking History</strong> – Track all your past and upcoming sessions</li>
        </ul>
        
        <h3>Mobile Friendly</h3>
        <p>Our booking system works perfectly on all devices – desktop, tablet, or smartphone. Book your sessions on the go!</p>
      `
    },
    'live-chat': {
      title: '💬 Live Chat',
      icon: '💬',
      color: 'linear-gradient(135deg, #4dff03, #00d0ff)',
      description: 'Communicate with your trainer in real-time, ask questions, and get instant feedback.',
      longDescription: `
        <h3>What is Live Chat?</h3>
        <p>Live chat allows you to communicate directly with your trainer in real-time. Ask questions, share updates, and get instant feedback between sessions.</p>
        
        <h3>Benefits</h3>
        <ul>
          <li><strong>✓ Instant Communication</strong> – Get answers when you need them</li>
          <li><strong>✓ Ask Questions</strong> – Clarify exercises, form, or nutrition</li>
          <li><strong>✓ Share Progress</strong> – Send updates, photos, or questions</li>
          <li><strong>✓ Stay Motivated</strong> – Regular check-ins keep you accountable</li>
          <li><strong>✓ Build Relationship</strong> – Develop a stronger connection with your trainer</li>
        </ul>
        
        <h3>How to Use</h3>
        <ul>
          <li>Log into your account</li>
          <li>Go to "My Bookings"</li>
          <li>Click on "Chat" next to your trainer</li>
          <li>Start messaging in real-time</li>
          <li>Receive notifications for new messages</li>
        </ul>
        
        <h3>Available 24/7</h3>
        <p>While your trainer may not be online 24/7, you can send messages anytime. Your trainer will respond as soon as they're available.</p>
      `
    }
  };

constructor(
  private route: ActivatedRoute,
  private router: Router
) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.topic = params['topic'];
    });
  }

  getCurrentTopic() {
    return this.topics[this.topic] || this.topics['personal-training'];
  }

  goBack() {
  window.history.back();
}

getStarted() {
  const token = localStorage.getItem('token');
  if (token) {
    this.router.navigate(['/trainers']);
  } else {
    this.router.navigate(['/login']);
  }
}
}