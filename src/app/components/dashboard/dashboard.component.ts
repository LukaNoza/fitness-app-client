import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadarChartComponent } from '../radar-chart/radar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RadarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  statLabels: string[] = ['STRENGTH', 'SPEED', 'ENDURANCE', 'FLEXIBILITY', 'STAMINA', 'ENERGY'];
  
  userStats: number[] = [85, 70, 92, 55, 78, 88];
  
  recommendations = [
    { icon: '💪', title: 'Strength Training', message: 'You\'re strong! Try increasing weight by 10%' },
    { icon: '🏃', title: 'Cardio Session', message: 'Speed could use improvement. Try interval training' },
    { icon: '🧘', title: 'Flexibility Work', message: 'Your flexibility is low. Daily stretching recommended' },
    { icon: '⚡', title: 'Energy Management', message: 'Great energy levels! Maintain with good sleep' }
  ];

  ngOnInit() {
    this.loadUserStats();
  }

  loadUserStats() {
    // TODO: Replace with actual API call
    // this.dashboardService.getUserStats().subscribe(stats => {
    //   this.userStats = stats;
    // });
  }

  getGrade(value: number): string {
    if (value >= 90) return 'A';
    if (value >= 75) return 'B';
    if (value >= 60) return 'C';
    if (value >= 40) return 'D';
    return 'E';
  }
}