import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainerService } from '../../services/trainer.service';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-trainers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainers.component.html',
  styleUrls: ['./trainers.component.css']  
})
export class TrainersComponent implements OnInit {
  trainers: Trainer[] = [];
  loading = true;
  error = '';
  showProfileModal = false;
  selectedTrainer: Trainer | null = null;

  constructor(private trainerService: TrainerService) {}

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (data) => {
        this.trainers = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  openProfile(trainerId: number) {
    console.log('🔵 Opening profile for trainer ID:', trainerId);
    
    this.trainerService.getTrainer(trainerId).subscribe({
      next: (trainer) => {
        console.log('✅ Trainer data received:', trainer);
        this.selectedTrainer = trainer;
        this.showProfileModal = true;
      },
      error: (err) => {
        console.error('❌ Error loading trainer details:', err);
        alert('Could not load trainer details');
      }
    });
  }

  closeProfile() {
    this.showProfileModal = false;
    this.selectedTrainer = null;
  }

  bookSession(trainerId: number) {
    console.log('Book session with trainer:', trainerId);
    // TODO: გადაყვანა booking-form-ზე trainerId-ით
  }
}