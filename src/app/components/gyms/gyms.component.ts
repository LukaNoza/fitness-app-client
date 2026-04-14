import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GymService } from '../../services/gym.service';
import { AuthService } from '../../services/auth.service';
import { Gym } from '../../models/gym.model';

@Component({
  selector: 'app-gyms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gyms.component.html',
  styleUrls: ['./gyms.component.css']
})
export class GymsComponent implements OnInit {
  gyms: Gym[] = [];
  loading = true;
  error = '';
  
  showAddGymForm = false;
  newGym: any = { name: '', address: '', city: '', phoneNumber: '', openTime: '', closeTime: '', isActive: true };
  
  showEditGymForm = false;
  editGymData: any = { id: 0, name: '', address: '', city: '', phoneNumber: '', openTime: '', closeTime: '', isActive: true };

  constructor(
    private gymService: GymService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadGyms();
  }

  loadGyms() {
    this.loading = true;
    this.gymService.getGyms().subscribe({
      next: (data) => {
        this.gyms = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  addGym() {
    if (
      !this.newGym.name ||
      !this.newGym.address ||
      !this.newGym.city ||
      !this.newGym.phoneNumber ||
      !this.newGym.openTime ||
      !this.newGym.closeTime
    ) {
      alert('Please fill all required fields');
      return;
    }

    const gymToCreate = {
      name: this.newGym.name,
      address: this.newGym.address,
      city: this.newGym.city,
      phoneNumber: this.newGym.phoneNumber,
      openTime: this.newGym.openTime + ':00',
      closeTime: this.newGym.closeTime + ':00',
      isActive: true
    };

    this.gymService.createGym(gymToCreate).subscribe({
      next: (gym) => {
        this.gyms.push(gym);
        this.closeModals();
        alert('Gym added successfully!');
        this.loadGyms();
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  editGym(gym: Gym) {
    // Convert time format (remove seconds if present)
    const openTime = gym.openTime.slice(0, 5);
    const closeTime = gym.closeTime.slice(0, 5);
    
    this.editGymData = { 
      ...gym, 
      openTime: openTime,
      closeTime: closeTime
    };
    this.showEditGymForm = true;
  }

  updateGym() {
    const gymToUpdate = {
      id: this.editGymData.id,
      name: this.editGymData.name,
      address: this.editGymData.address,
      city: this.editGymData.city,
      phoneNumber: this.editGymData.phoneNumber,
      openTime: this.editGymData.openTime + ':00',
      closeTime: this.editGymData.closeTime + ':00',
      isActive: this.editGymData.isActive
    };

    this.gymService.updateGym(this.editGymData.id, gymToUpdate).subscribe({
      next: () => {
        const index = this.gyms.findIndex(g => g.id === this.editGymData.id);
        if (index !== -1) {
          this.gyms[index] = { ...this.editGymData };
        }
        this.closeModals();
        alert('Gym updated successfully!');
        this.loadGyms();
      },
      error: (e) => {
        alert('Error: ' + (e.error?.message || e.message));
      }
    });
  }

  deleteGym(id: number) {
    if (confirm('Are you sure you want to delete this gym?')) {
      this.gymService.deleteGym(id).subscribe({
        next: () => {
          this.gyms = this.gyms.filter(g => g.id !== id);
          alert('Gym deleted successfully!');
        },
        error: (e) => {
          alert('Error: ' + (e.error?.message || e.message));
        }
      });
    }
  }

  closeModals() {
    this.showAddGymForm = false;
    this.showEditGymForm = false;
    
    // Reset forms
    this.newGym = {
      name: '',
      address: '',
      city: '',
      phoneNumber: '',
      openTime: '',
      closeTime: '',
      isActive: true
    };
    
    this.editGymData = {
      id: 0,
      name: '',
      address: '',
      city: '',
      phoneNumber: '',
      openTime: '',
      closeTime: '',
      isActive: true
    };
  }

  isAdmin(): boolean {
    return this.authService.getUserType() === 'Admin';
  }

  getActiveGymsCount(): number {
  return this.gyms.filter(g => g.isActive).length;
}

  getCitiesCount(): number {
    const cities = new Set(this.gyms.map(g => g.city));
    return cities.size;
  }
}