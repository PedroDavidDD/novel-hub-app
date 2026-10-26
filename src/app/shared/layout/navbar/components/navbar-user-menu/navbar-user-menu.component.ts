import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from '../../../../../../app/features/auth/services/auth.service';
import { ModalAlertService } from '../../../../services/modal-alert.service';

@Component({
  selector: 'navbar-user-menu',
  standalone: true,
  imports: [],
  templateUrl: './navbar-user-menu.component.html',
  styleUrl: './navbar-user-menu.component.css'
})
export class NavbarUserMenuComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalAlert = inject(ModalAlertService);

  @Input() isLoggedIn: boolean = false;

  public userName = 'Duke';
  public isUserMenu: boolean = false;

  userMenuItems = [
    { label: 'Perfil', link: '/account/profile', action: null },
    { label: 'Configuración', link: '/account/profile', action: null },
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

  async logout() {
    // 1. Confirm with Async Loading (Tests 'confirm' + 'loading' state)
    const confirmed = await this.modalAlert.alert({
      type: 'confirm',
      title: 'Cerrar sesión',
      message: '¿Estás seguro que deseas salir del sistema?',
      isStatic: true,
      onConfirm: () => new Promise(resolve => setTimeout(resolve, 1500))
    });

    if (confirmed) {
      // 2. Success Variant
      await this.modalAlert.alert({
        type: 'success',
        title: 'Éxito',
        message: 'Sesión cerrada correctamente',
        hideButtons: true,
        duration: 3000
      });

      this.authService.logout().pipe(take(1)).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }
}
