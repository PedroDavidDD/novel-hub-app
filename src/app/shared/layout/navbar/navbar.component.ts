import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../core/components';
import { CommonModule } from '@angular/common';
import { NavbarSearchComponent, NavbarUserMenuComponent } from './components';
import { NavbarService } from './services/navbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    ThemeSwitcherComponent,
    CommonModule,
    NavbarUserMenuComponent,
    NavbarSearchComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  public isLoggedIn: boolean = false;

  public isMenuOpen: boolean = false;

  public isNavbarSearch: boolean = false;

  constructor(private navbarService: NavbarService) {
    navbarService.isNavbarSearch$.subscribe((state) => {
      this.isNavbarSearch = state;
    });
  }

  toggleMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openModal() {
    this.navbarService.openModal();
  }
}
