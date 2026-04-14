export interface Booking {
    id: number;
    clientId: number;
    trainerId: number;
    gymId: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    status: string;
    totalAmount: number;
    createdAt: string;
}