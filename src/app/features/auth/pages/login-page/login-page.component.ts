import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ActionHandler } from '../../../../shared/utils/action-handler';

@Component({
  selector: 'auth-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styles: []
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private actionHandler = new ActionHandler(this.toastService);

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  public isLoading = false;

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
      action: this.authService.login({ email, password }),
      onSuccess: () => {
        this.isLoading = false;
        this.router.navigateByUrl('/');
      },
      onError: () => {
        this.isLoading = false;
      },
      successMessage: 'Welcome back! (5s Duration)',
      successTitle: 'Login Successful',
      successDuration: 5000, // Custom testing
      errorMessage: 'Invalid credentials. Please checking your email/password'
    });
  }
}
