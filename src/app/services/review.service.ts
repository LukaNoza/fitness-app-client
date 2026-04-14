import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private apiUrl = '/api/reviews';

    constructor(private http: HttpClient) { }

    getReviewsByTrainer(trainerId: number): Observable<Review[]> {
        return this.http.get<Review[]>(`${this.apiUrl}/trainer/${trainerId}`);
    }

    getReviewByBooking(bookingId: number): Observable<Review> {
        return this.http.get<Review>(`${this.apiUrl}/booking/${bookingId}`);
    }

    createReview(review: Partial<Review>): Observable<any> {
        console.log('📤 Sending review:', review);
        return this.http.post<any>(this.apiUrl, review);
    }

    deleteReview(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}