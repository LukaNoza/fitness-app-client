import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gym } from '../models/gym.model';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private apiUrl = '/api/gyms';

  constructor(private http: HttpClient) { }

  getGyms(): Observable<Gym[]> {
    return this.http.get<Gym[]>(this.apiUrl);
  }

  getGym(id: number): Observable<Gym> {
    return this.http.get<Gym>(`${this.apiUrl}/${id}`);
  }

  getGymsByCity(city: string): Observable<Gym[]> {
    return this.http.get<Gym[]>(`${this.apiUrl}/city/${city}`);
  }

  createGym(gym: any): Observable<Gym> {
    return this.http.post<Gym>(this.apiUrl, gym);
  }

  updateGym(id: number, gym: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, gym);
  }

  deleteGym(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  assignTrainerToGym(trainerGym: any): Observable<any> {
    return this.http.post<any>('/api/trainergyms', trainerGym);
  }
}