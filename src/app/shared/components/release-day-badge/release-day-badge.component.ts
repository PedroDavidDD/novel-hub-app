import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ReleaseBadgeVariant = 'primary' | 'secondary' | 'neutral' | 'disabled';

@Component({
  selector: 'app-release-day-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [attr.role]="isDisabled() ? null : 'button'"
      [attr.tabindex]="isDisabled() ? -1 : 0"
      [attr.aria-disabled]="isDisabled() ? true : null"
      [title]="titleText()"
      [class]="badgeClasses()"
      (click)="handleClick($event)"
      (keydown.enter)="handleClick($event)"
      (keydown.space)="handleClick($event)"
    >
      {{ vcLabel() }}
    </span>
  `,
})
export class ReleaseDayBadgeComponent {
  // Inputs dumb estándar
  vcLabel = input.required<string>();
  vcVariant = input<ReleaseBadgeVariant>('primary');
  disabled = input<boolean>(false);
  title = input<string>('');
  customClass = input<string>('');

  // Event Output desacoplado
  onClick = output<string>();

  readonly isDisabled = computed(() => this.disabled() || this.vcVariant() === 'disabled');

  readonly titleText = computed(() => {
    if (this.title()) return this.title();
    return this.isDisabled()
      ? `${this.vcLabel()} (Sin publicación)`
      : `${this.vcLabel()} (Día de lanzamiento)`;
  });

  readonly badgeClasses = computed(() => {
    const base =
      'inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-[10px] transition-all select-none';

    if (this.isDisabled()) {
      return [
        base,
        'bg-black/5 dark:bg-white/5 border-2 border-transparent text-[var(--color-description)]/40 dark:text-[var(--color-description)]/40 opacity-40 cursor-not-allowed pointer-events-none',
        this.customClass(),
      ]
        .filter(Boolean)
        .join(' ');
    }

    const interactive = 'cursor-pointer hover:translate-y-[-1px] hover:shadow-sm';
    const variants: Record<Exclude<ReleaseBadgeVariant, 'disabled'>, string> = {
      primary:
        'bg-[color-mix(in_srgb,var(--button-primary-bg)_20%,transparent)] border-2 border-transparent text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] hover:border-[var(--color-primary)]',
      secondary:
        'bg-[color-mix(in_srgb,var(--button-secondary-bg)_20%,transparent)] border-2 border-transparent text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary)] hover:border-[var(--color-secondary)]',
      neutral:
        'bg-[var(--color-bg-card)] border-2 border-transparent text-[var(--color-black)] hover:border-[var(--color-border)]',
    };

    const variantKey = this.vcVariant() === 'disabled' ? 'primary' : this.vcVariant();

    return [
      base,
      interactive,
      variants[variantKey as Exclude<ReleaseBadgeVariant, 'disabled'>],
      this.customClass(),
    ]
      .filter(Boolean)
      .join(' ');
  });

  handleClick(event: Event): void {
    if (this.isDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.stopPropagation();
    this.onClick.emit(this.vcLabel());
  }
}
