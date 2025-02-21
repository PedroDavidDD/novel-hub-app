import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'navbar-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {
  @Input() isLoggedIn: boolean = false;
  
  public userName = 'Duke';
  public isUserMenu: boolean = false;

  userMenuItems = [
    { label: 'Perfil', link: '/novels' },
    { label: 'Configuración', link: '/novels' },
    { label: 'Cerrar sesión', link: '/novels' },
  ];

  toggleUserMenu() {
    this.isUserMenu = !this.isUserMenu;
  }
}
