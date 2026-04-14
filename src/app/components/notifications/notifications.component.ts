import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
    notifications: Notification[] = [];
    @Output() onNavigateToBookings = new EventEmitter<number>();

    constructor(private notificationService: NotificationService) {
        this.notificationService.notifications$.subscribe(notifications => {
            this.notifications = notifications;
        });
    }

    onNotificationClick(notification: Notification) {
        this.notificationService.markAsRead(notification.id).subscribe();
        this.onNavigateToBookings.emit(notification.bookingId);
    }

    markAllAsRead() {
        this.notificationService.markAllAsRead();
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all notifications?')) {
            this.notificationService.clearAll().subscribe({
                next: () => {
                    console.log('All notifications cleared');
                },
                error: (err) => {
                    console.error('Error clearing notifications:', err);
                }
            });
        }
    }
}