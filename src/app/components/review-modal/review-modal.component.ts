import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent {
  @Input() bookingId!: number;
  @Input() trainerId!: number;
  @Input() trainerName!: string;
  @Input() bookingDate!: string;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();

  rating = 0;
  comment = '';
  submitting = false;
  errorMessage = '';

  constructor(private reviewService: ReviewService) {}

  setRating(value: number) {
    this.rating = value;
    this.errorMessage = '';
  }

  submitReview() {
    if (this.rating === 0) {
      this.errorMessage = 'Please select a rating';
      return;
    }
    
    this.submitting = true;
    this.errorMessage = '';
    
    const reviewData = {
      bookingId: this.bookingId,
      rating: this.rating,
      comment: this.comment || ''
    };
    
    console.log('Submitting review:', reviewData);
    
    this.reviewService.createReview(reviewData).subscribe({
      next: (response) => {
        console.log('Review submitted successfully:', response);
        this.submitting = false;
        this.onSuccess.emit();
        this.close();
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Error submitting review. Please try again.';
      }
    });
  }

  close() {
    this.onClose.emit();
  }
}