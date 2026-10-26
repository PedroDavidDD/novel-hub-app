import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'outline-primary'
  | 'outline-secondary'
  | 'white'
  | 'outline-white'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRounded = 'full' | 'xl' | 'lg' | 'md' | 'none';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type()"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel() || text()"
      [attr.title]="title() || text()"
      [class]="buttonClasses()"
      (click)="handleClick($event)"
    >
      @if (loading()) {
        <span class="inline-block animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
      }

      @if (text()) {
        <span>{{ text() }}</span>
      }

      <ng-content></ng-content>
    </button>
  `
})
export class CustomButtonComponent {
  // Inputs con Signals (Angular 19)
  text = input<string>('');
  type = input<ButtonType>('button');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  rounded = input<ButtonRounded>('full');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);
  customClass = input<string>('');
  ariaLabel = input<string>('');
  title = input<string>('');

  // Event Output
  onClick = output<MouseEvent>();

  isDisabled = computed(() => this.disabled() || this.loading());

  buttonClasses = computed(() => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all select-none cursor-pointer';

    const variants: Record<ButtonVariant, string> = {
      'primary': 'bg-[var(--button-primary-bg)] text-[var(--button-tc)] hover:bg-[var(--button-primary-bg-hover)] active:scale-95 shadow-sm border border-transparent',
      'secondary': 'bg-[var(--button-secondary-bg)] text-[var(--button-tc)] hover:bg-[var(--button-secondary-bg-hover)] active:scale-95 shadow-sm border border-transparent',
      'outline': 'bg-[color-mix(in_srgb,var(--button-primary-bg)_20%,transparent)] border-2 border-transparent text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--button-primary-bg)] hover:text-[var(--button-tc)] active:scale-95 shadow-sm',
      'outline-primary': 'bg-[color-mix(in_srgb,var(--button-primary-bg)_20%,transparent)] border-2 border-transparent text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--button-primary-bg)] hover:text-[var(--button-tc)] active:scale-95 shadow-sm',
      'outline-secondary': 'bg-[color-mix(in_srgb,var(--button-secondary-bg)_20%,transparent)] border-2 border-transparent text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary)] hover:border-[var(--color-secondary)] hover:bg-[var(--button-secondary-bg)] hover:text-[var(--button-tc)] active:scale-95 shadow-sm',
      'white': 'bg-white text-black border-2 border-white active:scale-95 shadow-sm',
      'outline-white': 'bg-black text-white border-2 border-black active:scale-95 shadow-sm',
      'danger': 'bg-[var(--color-error)] text-white hover:opacity-90 active:scale-95 shadow-sm border border-transparent'
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3.5 text-base'
    };

    const roundeds: Record<ButtonRounded, string> = {
      full: 'rounded-[25px]',
      xl: 'rounded-xl',
      lg: 'rounded-lg',
      md: 'rounded-md',
      none: 'rounded-none'
    };

    const width = this.fullWidth() ? 'w-full' : '';
    const disabledState = this.isDisabled() ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';

    return [
      base,
      variants[this.variant()],
      sizes[this.size()],
      roundeds[this.rounded()],
      width,
      disabledState,
      this.customClass()
    ].filter(Boolean).join(' ');
  });

  handleClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
  }
}
