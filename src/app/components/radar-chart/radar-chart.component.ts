import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit, AfterViewInit {
  @ViewChild('radarCanvas') radarCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() chartTitle: string = 'User Stats';  
  @Input() stats: number[] = [85, 70, 92, 55, 78, 88];
  @Input() labels: string[] = ['STRENGTH', 'SPEED', 'ENDURANCE', 'FLEXIBILITY', 'STAMINA', 'ENERGY'];
  
  private chart: Chart | null = null;

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.createRadarChart();
    }, 100);
  }

  private getGrade(value: number): string {
    if (value >= 90) return 'A';
    if (value >= 75) return 'B';
    if (value >= 60) return 'C';
    if (value >= 40) return 'D';
    return 'E';
  }

  private createRadarChart() {
    const ctx = this.radarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Stand Stats',
            data: this.stats,
            backgroundColor: 'rgba(0, 255, 255, 0.25)',
            borderColor: '#00ffff',
            borderWidth: 2,
            pointBackgroundColor: '#00ffff',
            pointBorderColor: '#00ffff',
            pointHoverBackgroundColor: '#ff00ff',
            pointHoverBorderColor: '#ff00ff',
            pointRadius: 5,
            pointHoverRadius: 8,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const grade = this.getGrade(value);
                return `${context.label}: ${grade} (${value}%)`;
              }
            },
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#00ffff',
            bodyColor: '#ffffff',
            borderColor: '#00ffff',
            borderWidth: 1
          },
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              backdropColor: 'transparent',
              color: '#00ffff',
              font: {
                size: 10,
                weight: 'bold'
              },
              callback: (value) => {
                const val = value as number;
                if (val === 100) return 'A';
                if (val === 80) return 'B';
                if (val === 60) return 'C';
                if (val === 40) return 'D';
                if (val === 20) return 'E';
                if (val === 0) return 'E';
                return '';
              }
            },
            grid: {
              color: 'rgba(0, 255, 255, 0.12)',
              circular: true,
              lineWidth: 1
            },
            angleLines: {
              color: 'rgba(0, 255, 255, 0.15)',
              display: true
            },
            pointLabels: {
              color: '#c0c0e0',
              font: {
                size: 10,
                weight: 'bold',
                family: "'Segoe UI', 'Inter', sans-serif"
              },
              padding: 8
            }
          }
        },
        elements: {
          line: {
            borderWidth: 2,
            borderColor: '#00ffff'
          },
          point: {
            pointStyle: 'circle'
          }
        },
        animation: {
          duration: 1400,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  updateStats(newStats: number[]) {
    this.stats = newStats;
    if (this.chart) {
      this.chart.data.datasets[0].data = newStats;
      this.chart.update();
    }
  }
}