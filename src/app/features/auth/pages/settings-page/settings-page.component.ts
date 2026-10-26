import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'auth-settings-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './settings-page.component.html',
  styles: []
})
export class SettingsPageComponent {}
