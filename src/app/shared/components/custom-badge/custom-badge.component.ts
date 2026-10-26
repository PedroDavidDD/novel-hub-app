import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'neutral';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      role="button"
      tabindex="0"
      [class]="badgeClasses()"
      (click)="handleClick($event)"
      (keydown.enter)="handleClick($event)"
      (keydown.space)="handleClick($event)"
    >
      {{ vcLabel() }}
    </span>
  `
})
export class CustomBadgeComponent {
  // Inputs Dumb con prefijos de nomenclatura según estándar
  vcLabel = input.required<string>();
  vcVariant = input<BadgeVariant>('primary');
  customClass = input<string>('');

  // Event Output desacoplado
  onClick = output<string>();

  badgeClasses = computed(() => {
    const base = 'inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full transition-all select-none cursor-pointer hover:translate-y-[-1px] hover:shadow-md';

    const variants: Record<BadgeVariant, string> = {
      'primary': 'bg-[color-mix(in_srgb,var(--button-primary-bg)_20%,transparent)] border-2 border-transparent text-[var(--color-primary-dark)] dark:text-[var(--color-primary)] hover:border-[var(--color-primary)]',
      'secondary': 'bg-[color-mix(in_srgb,var(--button-secondary-bg)_20%,transparent)] border-2 border-transparent text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary)] hover:border-[var(--color-secondary)]',
      'neutral': 'bg-[var(--color-bg-card)] border-2 border-transparent text-[var(--color-black)] hover:border-[var(--color-border)]'
    };

    return [
      base,
      variants[this.vcVariant()],
      this.customClass()
    ].filter(Boolean).join(' ');
  });

  handleClick(event: Event): void {
    event.stopPropagation();
    this.onClick.emit(this.vcLabel());
  }
}
