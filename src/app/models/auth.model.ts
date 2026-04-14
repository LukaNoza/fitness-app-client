export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password: string;
    userType: string;
}

export interface AuthResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    userType: string;
    token: string;
}