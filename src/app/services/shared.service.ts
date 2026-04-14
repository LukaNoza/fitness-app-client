import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private highlightBookingIdSubject = new BehaviorSubject<number | null>(null);
    public highlightBookingId$ = this.highlightBookingIdSubject.asObservable();

    setHighlightBookingId(id: number | null) {
        this.highlightBookingIdSubject.next(id);
    }
}