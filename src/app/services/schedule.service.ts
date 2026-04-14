import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = '/api/schedule';

    constructor(private http: HttpClient) {}

    getAvailableSlots(trainerId: number, gymId: number, date: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/available?trainerId=${trainerId}&gymId=${gymId}&date=${date}`);
    }
}