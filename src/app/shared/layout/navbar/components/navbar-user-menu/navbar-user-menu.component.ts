import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../../app/features/auth/services/auth.service';

@Component({
  selector: 'navbar-user-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-user-menu.component.html',
  styleUrl: './navbar-user-menu.component.css'
})
export class NavbarUserMenuComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() isLoggedIn: boolean = false;

  public userName = 'Duke';
  public isUserMenu: boolean = false;

  userMenuItems = [
    { label: 'Perfil', link: '/auth/profile', action: null },
    { label: 'Configuración', link: '/auth/settings', action: null },
    { label: 'Cerrar sesión', link: null, action: () => this.logout() },
  ];

  toggleUserMenu() {
    this.isUserMenu = !this.isUserMenu;
  }

  onMenuItemClick(item: any) {
    this.isUserMenu = false;
    if (item.action) {
      item.action();
    } else if (item.link) {
      this.router.navigate([item.link]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
