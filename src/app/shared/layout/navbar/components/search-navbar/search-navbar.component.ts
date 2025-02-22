import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-navbar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './search-navbar.component.html',
  styleUrl: './search-navbar.component.css',
})
export class SearchNavbarComponent {}
