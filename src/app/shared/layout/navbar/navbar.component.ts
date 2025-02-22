import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../core/components';
import { CommonModule } from '@angular/common';
import { 
  NavbarSearchComponent, 
  NavbarUserMenuComponent
} from "./components";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink, 
    ThemeSwitcherComponent, 
    CommonModule, 
    NavbarUserMenuComponent,
    NavbarSearchComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {

  public isLoggedIn: boolean = false;
  
  public isMenuOpen: boolean = false;

  public isNavbarSearch: boolean = false;
  
  toggleMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleNavbarSearch() {
    this.isNavbarSearch = !this.isNavbarSearch;
  }
}
