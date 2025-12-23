import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
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

      // // 3. Warning Variant
      // await this.modalAlert.alert({
      //   type: 'warning',
      //   title: 'Advertencia',
      //   message: 'Esto es una prueba de advertencia (Demo Warning)',
      // });

      // // 4. Error Variant
      // await this.modalAlert.alert({
      //   type: 'error',
      //   title: 'Error',
      //   message: 'Esto es una prueba de error (Demo Error)',
      // });

      // // 5. Info/Alert Variant (Self-closing, no buttons)
      // await this.modalAlert.alert({
      //   type: 'info',
      //   title: 'Información',
      //   message: 'Redirigiendo al login... (Demo Info - AutoClose)',
      // });

      // // 6. Info/Alert Variant (Self-closing, no buttons)
      // await this.modalAlert.alert({
      //   type: 'alert',
      //   title: 'Información',
      //   message: 'Redirigiendo al login... (Demo Info - AutoClose)',
      //   hideButtons: true,
      //   duration: 2000
      // });

      // Actual Logic
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
  }
}
