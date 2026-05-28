import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { TrainerService } from '../../services/trainer.service';
import { ReviewService } from '../../services/review.service';
import { ReviewModalComponent } from '../review-modal/review-modal.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReviewModalComponent, ChatComponent],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  highlightBookingId: number | null = null;
  bookings: any[] = [];
  loading = true;
  error = '';
  isTrainer = false;
  isAdmin = false;
  isClient = false;
  
  // Review Modal
  showReviewModal = false;
  selectedBooking: any = null;
  
  // For animation
  removingBookingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private trainerService: TrainerService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.isTrainer = this.authService.isTrainer();
    this.isAdmin = this.authService.isAdmin();
    this.isClient = this.authService.isClient();
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
        next: (data) => {
            console.log('📋 1. ALL bookings from API:', data.length);
            console.log('📋 2. All bookings IDs:', data.map(b => b.id));
            
            const activeBookings = data.filter(b => b.status !== 'Cancelled');
            console.log('📋 3. Active bookings (after filter):', activeBookings.length);
            console.log('📋 4. Active bookings IDs:', activeBookings.map(b => b.id));
            
            if (this.isAdmin) {
                this.bookings = activeBookings;
                console.log('📋 5. Admin - bookings set to:', this.bookings.length);
            } 
            else if (this.isTrainer) {
                console.log('📋 5. Trainer mode - filtering...');
                const currentUser = this.authService.getUser();
                this.trainerService.getTrainers().subscribe({
                    next: (trainers) => {
                        const trainer = trainers.find(t => t.userId === currentUser?.id);
                        if (trainer) {
                            this.bookings = activeBookings.filter(b => b.trainerId === trainer.id);
                            console.log('📋 6. Trainer bookings:', this.bookings.length, 'IDs:', this.bookings.map(b => b.id));
                        } else {
                            this.bookings = [];
                            console.log('📋 6. No trainer found');
                        }
                        this.checkReviewsAndFinish();
                    },
                    error: () => {
                        this.bookings = [];
                        this.checkReviewsAndFinish();
                    }
                });
                return;
            }
            else if (this.isClient) {
                const currentUser = this.authService.getUser();
                this.bookings = activeBookings.filter(b => b.clientId === currentUser?.id);
                console.log('📋 5. Client bookings:', this.bookings.length, 'IDs:', this.bookings.map(b => b.id));
            }
            else {
                this.bookings = activeBookings;
                console.log('📋 5. Other - bookings set to:', this.bookings.length);
            }
            
            this.checkReviewsAndFinish();
        },
        error: (err) => {
            console.error('❌ Error loading bookings:', err);
            this.error = err.message;
            this.loading = false;
        }
    });
  }

  // შეამოწმე რომელ ჯავშნებს აქვთ უკვე შეფასება
  checkReviewsAndFinish() {
    console.log('📢 Bookings to check:', this.bookings.map(b => ({ id: b.id, hasReview: b.hasReview })));
    
    if (this.bookings.length === 0) {
        this.sortAndFinish();
        return;
    }

    const reviewChecks = this.bookings.map(booking =>
        this.reviewService.getReviewByBooking(booking.id).toPromise()
            .then(review => {
                console.log(`✅ Booking ${booking.id} has review:`, review);
                booking.hasReview = !!review;
                return booking;
            })
            .catch((err) => {
                console.log(`❌ Booking ${booking.id} has no review`);
                booking.hasReview = false;
                return booking;
            })
    );

    Promise.all(reviewChecks).then(() => {
        console.log('📋 Final hasReview status:', this.bookings.map(b => ({ id: b.id, hasReview: b.hasReview })));
        this.sortAndFinish();
    });
  }

  sortAndFinish() {
    this.bookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
    this.loading = false;
  }

  getPendingCount(): number {
    return this.bookings.filter(b => b.status === 'Pending').length;
  }

  getConfirmedCount(): number {
    return this.bookings.filter(b => b.status === 'Confirmed').length;
  }

  getCompletedCount(): number {
    return this.bookings.filter(b => b.status === 'Completed').length;
  }

  confirmBooking(bookingId: number) {
    if (confirm('Are you sure you want to confirm this booking?')) {
      this.bookingService.updateBookingStatus(bookingId, 'Confirmed').subscribe({
        next: () => {
          const booking = this.bookings.find(b => b.id === bookingId);
          if (booking) {
            booking.status = 'Confirmed';
          }
          alert('✅ Booking confirmed successfully!');
        },
        error: (err) => {
          alert('❌ Error: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  completeBooking(bookingId: number) {
    if (confirm('Mark this booking as completed?')) {
      this.bookingService.updateBookingStatus(bookingId, 'Completed').subscribe({
        next: () => {
          const booking = this.bookings.find(b => b.id === bookingId);
          if (booking) {
            booking.status = 'Completed';
          }
          alert('✅ Booking marked as completed!');
        },
        error: (err) => {
          alert('❌ Error: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  cancelBooking(bookingId: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.removingBookingId = bookingId;
      
      this.bookingService.updateBookingStatus(bookingId, 'Cancelled').subscribe({
        next: (response) => {
          this.bookings = this.bookings.filter(b => b.id !== bookingId);
          this.removingBookingId = null;
          alert('✅ Booking cancelled and removed!');
        },
        error: (err) => {
          this.removingBookingId = null;
          alert('❌ Error: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  // Review Modal Methods
  openReviewModal(booking: any) {
    this.selectedBooking = booking;
    this.showReviewModal = true;
  }

  closeReviewModal() {
    this.showReviewModal = false;
    this.selectedBooking = null;
  }

  onReviewSuccess() {
    console.log('🎉 Review success! Selected booking:', this.selectedBooking);
    
    if (this.selectedBooking) {
        // პირდაპირ განაახლე hasReview
        const index = this.bookings.findIndex(b => b.id === this.selectedBooking.id);
        if (index !== -1) {
            this.bookings[index] = { ...this.bookings[index], hasReview: true };
            // აიძულე სიის განახლება
            this.bookings = [...this.bookings];
        }
    }
    
    alert('⭐ Thank you for your review!');
    this.closeReviewModal();
    
    // დამატებითი გადატვირთვა (სურვილისამებრ)
    setTimeout(() => {
        this.loadBookings();
    }, 500);
  }
}