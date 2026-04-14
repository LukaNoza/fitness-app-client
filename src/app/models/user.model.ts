export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    userType: string;
    isActive: boolean;
    createdAt: Date;
}