import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from '../../services/validators.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ActionHandler } from '../../../../shared/utils/action-handler';
import { GoogleLoginButtonComponent } from '../../components/social/google-login-button.component';
import { FacebookLoginButtonComponent } from '../../components/social/facebook-login-button.component';
import { SocialProviderType } from '../../interfaces/social/social-auth.interface';

@Component({
  selector: 'auth-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    GoogleLoginButtonComponent,
    FacebookLoginButtonComponent
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private validatorsService = inject(ValidatorsService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private actionHandler = new ActionHandler(this.toastService);

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: [
      this.validatorsService.isFieldOneEqualFieldTwo('password', 'confirmPassword')
    ]
  });

  public isLoading = false;

  // Estados de login social
  isSocialLoading = this.authService.isSocialLoading;

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }

  getFieldError(field: string): string | null {
    if (!this.registerForm.controls[field]) return null;

    const errors = this.registerForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'email':
          return 'Invalid email format';
        case 'minlength':
          return `Minimum ${errors['minlength'].requiredLength} characters required`;
        case 'notEqual':
          return 'Passwords do not match';
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { name, username, email, password } = this.registerForm.value;

    this.actionHandler.execute({
      action: this.authService.register({ name, username, email, password }),
      onSuccess: (result) => {
        this.isLoading = false;
        if (result.success) {
          this.router.navigateByUrl('/home');
        }
      },
      onError: () => {
        this.isLoading = false;
      },
      successMessage: 'Account created successfully! Welcome.'
    });
  }

  /**
   * Maneja el login con proveedores sociales (Google, Facebook)
   */
  onSocialLogin(provider: SocialProviderType): void {
    this.actionHandler.execute({
      action: this.authService.loginWithSocial(provider),
      onSuccess: (result) => {
        if (result.success) {
          this.router.navigateByUrl('/home');
        }
      },
      onError: () => {
        // El error ya se maneja en el servicio
      },
      successMessage: `Welcome! You've joined with ${provider}.`,
      successTitle: 'Registration Successful',
      errorMessage: `Failed to continue with ${provider}. Please try again.`
    });
  }
}
