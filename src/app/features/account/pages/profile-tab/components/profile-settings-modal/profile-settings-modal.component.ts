import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../../../../../shared/components/modal/modal.component';
import { CustomButtonComponent } from '../../../../../../shared/components/custom-button/custom-button.component';
import { User } from '../../../../../../core/models/user.model';

@Component({
  selector: 'app-profile-settings-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    CustomButtonComponent,
  ],
  templateUrl: './profile-settings-modal.component.html',
  styleUrls: ['./profile-settings-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingsModalComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs & Outputs
  readonly show = input<boolean>(false);
  readonly user = input<User | null>(null);
  readonly isLoading = input<boolean>(false);

  readonly onClose = output<void>();
  readonly onSave = output<{ name: string; about: string; password?: string }>();

  readonly form: FormGroup = this.fb.group({
    email: [{ value: '', disabled: true }],
    name: ['', [Validators.required, Validators.minLength(2)]],
    about: [''],
    newPassword: ['', [Validators.minLength(6)]],
    confirmPassword: [''],
  });

  readonly passwordMismatch = signal<boolean>(false);

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.form.patchValue({
          email: u.email || '',
          name: u.name || '',
          about: (u as any).about || '',
        });
      }
    });
  }

  handleClose(): void {
    this.onClose.emit();
  }

  handleUploadAvatar(): void {
    console.log('Upload avatar clicked');
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, about, newPassword, confirmPassword } = this.form.getRawValue();

    if (newPassword && newPassword !== confirmPassword) {
      this.passwordMismatch.set(true);
      return;
    }

    this.passwordMismatch.set(false);
    this.onSave.emit({
      name,
      about,
      password: newPassword || undefined,
    });
  }
}
