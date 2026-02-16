import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialProviderType } from '../../interfaces/social/social-auth.interface';

/**
 * Componente genérico para botones de login social
 * Configurable para cualquier proveedor OAuth
 */
@Component({
  selector: 'app-social-login-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="social-btn"
      [class]="'social-btn--' + provider()"
      [style.--provider-color]="color()"
      (click)="onClick()"
      [disabled]="isLoading() || isDisabled()"
    >
      @if (isLoading()) {
        <span class="spinner"></span>
      } @else {
        <ng-content select="[icon]"></ng-content>
        <span class="social-btn__text">
          {{ text() || 'Continue with ' + providerLabel() }}
        </span>
      }
    </button>
  `,
  styles: [`
    :host {
      display: block;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .social-btn:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .social-btn--google:hover:not(:disabled) {
      border-color: #4285F4;
    }

    .social-btn--facebook:hover:not(:disabled) {
      border-color: #1877F2;
    }

    .social-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid #e5e7eb;
      border-top-color: var(--provider-color, #3b82f6);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .social-btn__text {
      color: #374151;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialLoginButtonComponent {
  provider = input.required<SocialProviderType>();
  providerLabel = input<string>('');
  text = input<string>('');
  color = input<string>('#000');
  isLoading = input<boolean>(false);
  isDisabled = input<boolean>(false);

  clicked = output<SocialProviderType>();

  onClick(): void {
    this.clicked.emit(this.provider());
  }
}
