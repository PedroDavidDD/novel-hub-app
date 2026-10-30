import { Component, inject, input } from '@angular/core';
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
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modalAlert = inject(ModalAlertService);

  readonly isLoggedIn = input<boolean>(false);

  readonly user = this.authService.user;
  readonly isAuthenticated = this.authService.isAuthenticated;

  public isUserMenu: boolean = false;

  get userName(): string {
    const u = this.user();
    return u?.name || u?.username || 'Duke';
  }

  get userRange(): string {
    const u = this.user();
    return (u as any)?.range || u?.roleDisplayName || u?.role || 'Platino';
  }

  get userPoints(): number | string {
    const u = this.user();
    return (u as any)?.points ?? 10000;
  }

  get userLevel(): number | string {
    const u = this.user();
    return (u as any)?.level ?? 10000;
  }

  userMenuItems = [
    { label: 'Perfil', link: '/account/profile', action: null },
    { label: 'Configuración', link: '/account/profile', action: null },
    { label: 'Cerrar sesión', link: null, action: () => this.logout() },
  ];

  toggleUserMenu(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.isUserMenu = !this.isUserMenu;
  }

  onAvatarError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/novel1.jpg';
    }
  }

  onMenuItemClick(item: any): void {
    this.isUserMenu = false;
    if (item.action) {
      item.action();
    } else if (item.link) {
      this.router.navigate([item.link]);
    }
  }

  async logout(): Promise<void> {
    const confirmed = await this.modalAlert.alert({
      type: 'confirm',
      title: 'Cerrar sesión',
      message: '¿Estás seguro que deseas salir del sistema?',
      isStatic: true,
      onConfirm: () => new Promise(resolve => setTimeout(resolve, 1500))
    });

    if (confirmed) {
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
