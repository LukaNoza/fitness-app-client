import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';   // 👈 დაამატე

export interface Notification {
    id: number;
    title: string;
    message: string;
    bookingId: number;
    isRead: boolean;
    createdAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = '/api/notifications';
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();
    
    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();

    private pollingInterval: any = null;   // 👈 ინტერვალის ID

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        // 👇 მხოლოდ ავტორიზებული მომხმარებლისთვის
        if (this.authService.isLoggedIn()) {
            this.loadNotifications();
            this.startPolling();
        }
    }

    loadNotifications() {
        if (!this.authService.isLoggedIn()) return;

        this.http.get<Notification[]>(this.apiUrl).subscribe({
            next: (notifications) => {
                this.notificationsSubject.next(notifications);
                this.updateUnreadCount();
            },
            error: (err) => {
                // 401-ს არ ლოგავთ – ეს მოსალოდნელია, როცა მომხმარებელი არ არის შესული
                if (err.status !== 401) {
                    console.error('Error loading notifications:', err);
                }
            }
        });
    }

    markAsRead(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/read`, {}).pipe(
            tap(() => {
                const notifications = this.notificationsSubject.value;
                const updated = notifications.map(n => 
                    n.id === id ? { ...n, isRead: true } : n
                );
                this.notificationsSubject.next(updated);
                this.updateUnreadCount();
            })
        );
    }

    markAllAsRead() {
        this.notificationsSubject.value.forEach(notification => {
            if (!notification.isRead) {
                this.markAsRead(notification.id).subscribe();
            }
        });
    }

    clearAll(): Observable<any> {
        return this.http.delete(this.apiUrl).pipe(
            tap(() => {
                this.notificationsSubject.next([]);
                this.updateUnreadCount();
            })
        );
    }

    private startPolling() {
        if (this.pollingInterval) clearInterval(this.pollingInterval);
        this.pollingInterval = setInterval(() => {
            // 👇 მხოლოდ ლოგინებულისთვის
            if (this.authService.isLoggedIn()) {
                this.loadNotifications();
            }
        }, 10000);
    }

    private updateUnreadCount() {
        const unreadCount = this.notificationsSubject.value.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(unreadCount);
    }

    // 👇 (სურვილისამებრ) ლოგაუთის დროს გაწყვიტე პოლინგი
    public stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}