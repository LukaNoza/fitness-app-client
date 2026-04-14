import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { TrainerService } from '../../services/trainer.service';
import { GymService } from '../../services/gym.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Trainer } from '../../models/trainer.model';
import { Gym } from '../../models/gym.model';
import { User } from '../../models/user.model';
import { ScheduleService } from '../../services/schedule.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  trainers: Trainer[] = [];
  gyms: Gym[] = [];
  clients: User[] = [];
  filteredClients: User[] = [];
  selectedClientEmail: string = '';
  selectedClientInfo: User | null = null;
  availableSlots: any[] = [];
  selectedSlotId: number | null = null;
  selectedTrainer: any = null;
  selectedGym: any = null;
  loadingSlots = false;
  
  booking: any = {
    clientId: 0,
    trainerId: 0,
    gymId: 0,
    bookingDate: '',
    startTime: '',
    endTime: '',
    status: 'Pending',
    totalAmount: 0
  };
  
  loading = false;
  message = '';
  messageType = '';
  minDate = new Date().toISOString().split('T')[0];
  private loadSlotsTimeout: any = null;

  constructor(
    private bookingService: BookingService,
    private trainerService: TrainerService,
    private gymService: GymService,
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getUser();
    const userType = this.authService.getUserType();
    
    if (userType === 'Admin' || userType === 'Trainer') {
      this.loadClients();
      this.booking.clientId = 0;
    } else {
      this.booking.clientId = currentUser?.id || 0;
    }
    
    this.loadTrainers();
    this.loadGyms();
  }

  loadClients() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.clients = users
          .filter(u => u.userType === 'Client' && u.isActive)
          .sort((a, b) => {
            const fullNameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const fullNameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return fullNameA.localeCompare(fullNameB);
          });
        this.filteredClients = this.clients;
        console.log('Clients loaded:', this.clients);
      },
      error: (err: any) => console.error('Error loading clients:', err)
    });
  }

  onClientEmailInput() {
    const searchTerm = this.selectedClientEmail.toLowerCase();
    
    if (searchTerm === '') {
      this.filteredClients = this.clients;
      this.selectedClientInfo = null;
      this.booking.clientId = 0;
      return;
    }
    
    this.filteredClients = this.clients.filter(client => 
      client.email.toLowerCase().includes(searchTerm) ||
      client.firstName.toLowerCase().includes(searchTerm) ||
      client.lastName.toLowerCase().includes(searchTerm) ||
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm)
    );
  }

  onClientEmailSelect() {
    const selectedEmail = this.selectedClientEmail;
    
    const exactMatch = this.clients.find(client => 
      client.email.toLowerCase() === selectedEmail.toLowerCase()
    );
    
    if (exactMatch) {
      this.selectedClientInfo = exactMatch;
      this.booking.clientId = exactMatch.id;
      this.selectedClientEmail = exactMatch.email;
    } else {
      const partialMatch = this.clients.find(client => 
        client.email.toLowerCase().includes(selectedEmail.toLowerCase())
      );
      
      if (partialMatch) {
        this.selectedClientInfo = partialMatch;
        this.booking.clientId = partialMatch.id;
        this.selectedClientEmail = partialMatch.email;
      } else {
        this.selectedClientInfo = null;
        this.booking.clientId = 0;
      }
    }
  }

  isAdminOrTrainer(): boolean {
    const userType = this.authService.getUserType();
    return userType === 'Admin' || userType === 'Trainer';
  }

  loadTrainers() {
    this.trainerService.getTrainers().subscribe({
      next: (data) => { 
        this.trainers = data;
        console.log('Trainers loaded:', this.trainers.map(t => ({ id: t.id, name: t.name, gyms: t.gyms })));
      },
      error: (err: any) => console.error('Error loading trainers:', err)
    });
  }

  loadGyms() {
    this.gymService.getGyms().subscribe({
      next: (data) => { 
        this.gyms = data;
        console.log('Gyms loaded:', this.gyms);
      },
      error: (err: any) => console.error('Error loading gyms:', err)
    });
  }

  onTrainerChange() {
    this.selectedTrainer = this.trainers.find(t => t.id === this.booking.trainerId);
    console.log('Selected trainer:', this.selectedTrainer);
    console.log('Trainer gyms:', this.selectedTrainer?.gyms);
    
    if (this.selectedTrainer && this.selectedTrainer.gyms && this.selectedTrainer.gyms.length > 0) {
      const availableGymIds = this.selectedTrainer.gyms.map((g: { id: any; }) => g.id);
      if (!availableGymIds.includes(this.booking.gymId)) {
        this.booking.gymId = 0;
        this.selectedGym = null;
      }
    }
    
    this.debounceLoadSlots();
  }

  onGymChange() {
    this.selectedGym = this.gyms.find(g => g.id === this.booking.gymId);
    console.log('Selected gym:', this.selectedGym);
    this.debounceLoadSlots();
  }

  debounceLoadSlots() {
    if (this.loadSlotsTimeout) {
      clearTimeout(this.loadSlotsTimeout);
    }
    
    this.loadSlotsTimeout = setTimeout(() => {
      this.loadAvailableSlots();
    }, 300);
  }

  loadAvailableSlots() {
    if (!this.booking.trainerId || !this.booking.gymId || !this.booking.bookingDate) {
      this.availableSlots = [];
      return;
    }

    const trainer = this.trainers.find(t => t.id === this.booking.trainerId);
    if (trainer && trainer.gyms && !trainer.gyms.some((g: any) => g.id === this.booking.gymId)) {
      console.log('Trainer does not work at this gym');
      this.availableSlots = [];
      return;
    }

    this.loadingSlots = true;
    this.scheduleService.getAvailableSlots(
      this.booking.trainerId,
      this.booking.gymId,
      this.booking.bookingDate
    ).subscribe({
      next: (slots: any[]) => {
        console.log('Available slots received:', slots);
        this.availableSlots = slots.filter((slot: any) => slot.availableSpots > 0);
        this.loadingSlots = false;
        this.selectedSlotId = null;
        this.booking.startTime = '';
        this.booking.endTime = '';
      },
      error: (err: any) => {
        console.error('Error loading slots:', err);
        this.availableSlots = [];
        this.loadingSlots = false;
      }
    });
  }

  selectSlot(slot: any) {
    this.selectedSlotId = slot.id;
    this.booking.startTime = slot.startTime;
    this.booking.endTime = slot.endTime;
  }

  onSubmit() {
    if (this.isAdminOrTrainer() && !this.booking.clientId) {
      this.message = 'Please select a valid client';
      this.messageType = 'error';
      return;
    }

    if (!this.booking.trainerId || !this.booking.gymId || !this.booking.bookingDate || !this.booking.startTime || !this.booking.endTime) {
      this.message = 'Please select trainer, gym, date and time slot';
      this.messageType = 'error';
      return;
    }

    if (!this.booking.clientId) {
      this.message = 'You must be logged in to book a session';
      this.messageType = 'error';
      return;
    }

    const selectedTrainer = this.trainers.find(t => t.id === this.booking.trainerId);
    const startHour = parseInt(this.booking.startTime.split(':')[0]);
    const endHour = parseInt(this.booking.endTime.split(':')[0]);
    const hours = endHour - startHour;
    const totalAmount = selectedTrainer ? selectedTrainer.hourlyRate * hours : 80;

    const bookingToSend = {
      clientId: Number(this.booking.clientId),
      trainerId: Number(this.booking.trainerId),
      gymId: Number(this.booking.gymId),
      bookingDate: this.booking.bookingDate,
      startTime: this.booking.startTime + ':00',
      endTime: this.booking.endTime + ':00',
      status: 'Pending',
      totalAmount: totalAmount
    };
    
    console.log('📤 Sending booking:', JSON.stringify(bookingToSend, null, 2));
    
    this.loading = true;
    this.message = '';
    
    this.bookingService.createBooking(bookingToSend).subscribe({
      next: (data: any) => {
        console.log('✅ Success:', data);
        
        const trainer = this.trainers.find(t => t.id === this.booking.trainerId);
        
        
        
        this.message = '✅ Booking created successfully!';
        this.messageType = 'success';
        this.loading = false;
        this.resetForm();
        
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: (err: any) => {
        console.error('❌ Full error:', err);
        let errorMsg = err.error?.message || 'Error creating booking';
        this.message = errorMsg;
        this.messageType = 'error';
        this.loading = false;
      }
    });
  }

  resetForm() {
    const currentUser = this.authService.getUser();
    const userType = this.authService.getUserType();
    
    this.booking = {
      clientId: (userType === 'Admin' || userType === 'Trainer') ? 0 : (currentUser?.id || 0),
      trainerId: 0,
      gymId: 0,
      bookingDate: '',
      startTime: '',
      endTime: '',
      status: 'Pending',
      totalAmount: 0
    };
    
    this.selectedClientEmail = '';
    this.selectedClientInfo = null;
    this.filteredClients = this.clients;
    this.availableSlots = [];
    this.selectedSlotId = null;
    this.selectedTrainer = null;
    this.selectedGym = null;
  }
}