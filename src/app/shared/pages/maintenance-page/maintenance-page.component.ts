import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-maintenance-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintenance-page.component.html',
  styleUrls: ['./maintenance-page.component.css']
})
export class MaintenancePageComponent {
  estimatedTime: number = 60 * 30; // Tiempo estimado en segundos (30 min)
  
  constructor() {
    this.startCountdown();
  }

  startCountdown() {
    const interval = setInterval(() => {
      if (this.estimatedTime > 0) {
        this.estimatedTime--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.estimatedTime / 60);
    const seconds = this.estimatedTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
