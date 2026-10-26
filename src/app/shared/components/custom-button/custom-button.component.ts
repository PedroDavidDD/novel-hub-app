import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
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
    const base = 'inline-flex items-center justify-center font-semibold rounded-[25px] transition-all select-none border-none cursor-pointer';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[var(--button-primary-bg)] text-[var(--button-tc)] hover:bg-[var(--button-primary-bg-hover)] active:scale-95 shadow-sm',
      secondary: 'bg-[var(--button-secondary-bg)] text-[var(--button-tc)] hover:bg-[var(--button-secondary-bg-hover)] active:scale-95 shadow-sm',
      outline: 'bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-black)] hover:bg-[var(--button-primary-bg)] active:scale-95',
      danger: 'bg-[var(--color-error)] text-white hover:opacity-90 active:scale-95 shadow-sm'
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const width = this.fullWidth() ? 'w-full' : '';
    const disabledState = this.isDisabled() ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';

    return [
      base,
      variants[this.variant()],
      sizes[this.size()],
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
