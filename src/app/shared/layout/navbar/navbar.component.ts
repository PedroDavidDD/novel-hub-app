import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSwitcherComponent } from '../../../core/components';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from "./components";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink, 
    ThemeSwitcherComponent, 
    CommonModule, 
    UserMenuComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {

  public isLoggedIn: boolean = true;
  
  public isMenuOpen: boolean = true;

}
