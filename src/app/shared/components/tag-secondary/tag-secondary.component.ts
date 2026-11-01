import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag-secondary',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      role="button"
      tabindex="0"
      [class]="tagClasses()"
      (click)="handleClick($event)"
      (keydown.enter)="handleClick($event)"
      (keydown.space)="handleClick($event)"
    >
      {{ formattedLabel() }}
    </span>
  `,
})
export class TagSecondaryComponent {
  // Input dumb estándar
  vcLabel = input.required<string>();
  customClass = input<string>('');

  // Event Output desacoplado
  onClick = output<string>();

  readonly formattedLabel = computed(() => {
    const raw = this.vcLabel().trim();
    return raw.startsWith('#') ? raw : `#${raw}`;
  });

  readonly tagClasses = computed(() => {
    const base =
      'cursor-pointer transition-colors text-xs font-medium text-[var(--color-description)] hover:text-[var(--color-black)] break-words select-none';
    return [base, this.customClass()].filter(Boolean).join(' ');
  });

  handleClick(event: Event): void {
    event.stopPropagation();
    this.onClick.emit(this.vcLabel());
  }
}
