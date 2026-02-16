import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthFacade } from '../../../../core/services/auth.facade';
import { ToastService } from '../../../../shared/services/toast.service';
import { ActionHandler } from '../../../../shared/utils/action-handler';
import { GoogleLoginButtonComponent } from '../../components/social/google-login-button.component';
import { FacebookLoginButtonComponent } from '../../components/social/facebook-login-button.component';
import { SocialProviderType } from '../../interfaces/social/social-auth.interface';

@Component({
  selector: 'auth-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    GoogleLoginButtonComponent,
    FacebookLoginButtonComponent
  ],
  templateUrl: './login-page.component.html',
  styles: []
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private actionHandler = new ActionHandler(this.toastService);

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public isLoading = false;

  // Estados de login social
  isSocialLoading = this.authFacade.isSocialLoading;

  isValidField(field: string): boolean | null {
    return this.loginForm.controls[field].errors
      && this.loginForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {
    if (!this.loginForm.controls[field]) return null;

    const errors = this.loginForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'email':
          return 'Invalid email format';
        case 'minlength':
          return `Minimum ${errors['minlength'].requiredLength} characters required`;
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.actionHandler.execute({
      action: this.authFacade.login({ email, password }),
      onSuccess: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/');
      },
      onError: () => {
        this.isLoading = false;
      },
      successMessage: 'Welcome back! (5s Duration)',
      successTitle: 'Login Successful',
      successDuration: 5000,
      errorMessage: 'Invalid credentials. Please checking your email/password'
    });
  }

  /**
   * Maneja el login con proveedores sociales (Google, Facebook)
   */
  onSocialLogin(provider: SocialProviderType): void {
    this.actionHandler.execute({
      action: this.authFacade.loginWithSocial(provider),
      onSuccess: () => {
        this.router.navigateByUrl('/');
      },
      onError: () => {
        // El error ya se maneja en el facade
      },
      successMessage: `Welcome! You've signed in with ${provider}.`,
      successTitle: 'Login Successful',
      errorMessage: `Failed to login with ${provider}. Please try again.`
    });
  }
}
