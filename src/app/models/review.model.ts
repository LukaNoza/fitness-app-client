export interface Review {
    id: number;
    bookingId: number;
    clientId: number;
    trainerId: number;
    rating: number;
    comment: string;
    createdAt: string;
    clientName?: string;
}