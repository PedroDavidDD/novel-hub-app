import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'navbar-user-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-user-menu.component.html',
  styleUrl: './navbar-user-menu.component.css'
})
export class NavbarUserMenuComponent {
  @Input() isLoggedIn: boolean = false;
  
  public userName = 'Duke';
  public isUserMenu: boolean = false;

  userMenuItems = [
    { label: 'Perfil', link: '/profile' },
    { label: 'Configuración', link: '/setting' },
    { label: 'Cerrar sesión', link: '/novels' },
  ];

  toggleUserMenu() {
    this.isUserMenu = !this.isUserMenu;
  }
}
