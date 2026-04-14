export interface Trainer {
    id: number;
    userId: number;
    name: string;
    specialization: string;
    experienceYears: number;
    hourlyRate: number;
    rating: number;
    isVerified: boolean;
    gyms: {
        id: number;
        name: string;
        city: string;
    }[];
    workDays?: string;
    workStart?: string;
    workEnd?: string;
}