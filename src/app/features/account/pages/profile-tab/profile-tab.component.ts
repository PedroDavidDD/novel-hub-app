import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { ProfileSettingsModalComponent } from './components/profile-settings-modal/profile-settings-modal.component';
import { ModalAlertService } from '../../../../shared/services/modal-alert.service';
import { dashText } from '../../../../shared/utils/dash.util';
import { formatDateTime } from '../../../../shared/utils/date.util';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-tab',
  standalone: true,
  imports: [
    CommonModule,
    CustomButtonComponent,
    ProfileSettingsModalComponent,
  ],
  templateUrl: './profile-tab.component.html',
  styleUrls: ['./profile-tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileTabComponent {
  private readonly authService = inject(AuthService);
  private readonly modalAlert = inject(ModalAlertService);

  readonly user = this.authService.user;
  readonly isModalOpen = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  formatDash(value?: string | null): string {
    return dashText(value);
  }

  formatDate(value?: string | number | Date | null): string {
    return formatDateTime(value);
  }

  openSettingsModal(): void {
    this.isModalOpen.set(true);
  }

  closeSettingsModal(): void {
    this.isModalOpen.set(false);
  }

  async handleSaveProfile(payload: { name: string; about: string; password?: string }): Promise<void> {
    this.isSaving.set(true);

    try {
      const currentUser = this.user();
      if (currentUser) {
        const updated: User = {
          ...currentUser,
          name: payload.name,
          about: payload.about,
        };
        this.authService.updateUserData(updated);
      }

      await this.modalAlert.alert({
        type: 'success',
        title: 'Perfil Actualizado',
        message: 'Tus datos han sido guardados correctamente.',
        hideButtons: true,
        duration: 2000,
      });

      this.closeSettingsModal();
    } finally {
      this.isSaving.set(false);
    }
  }

  async onSignOut(): Promise<void> {
    const confirmed = await this.modalAlert.alert({
      type: 'confirm',
      title: 'Cerrar sesión',
      message: '¿Estás seguro que deseas salir del sistema?',
      isStatic: true,
    });

    if (confirmed) {
      this.authService.logout().subscribe();
    }
  }
}
