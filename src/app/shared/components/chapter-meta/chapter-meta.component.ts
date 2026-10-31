import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { formatDateOnly } from '../../utils/date.util';

@Component({
  selector: 'app-chapter-meta',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="flex items-center gap-3 text-xs text-[var(--color-description)] flex-shrink-0" [class]="customClass()">
      <!-- Fecha de Publicación con Icono de Calendario -->
      <div class="flex items-center gap-1.5" [title]="'Fecha: ' + formattedDate()">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clip-rule="evenodd" />
        </svg>
        <span class="font-normal">{{ formattedDate() }}</span>
      </div>

      <!-- Vistas con Icono de Ojo -->
      <div class="flex items-center gap-1.5" [title]="'Vistas: ' + (vcViews() | number)">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          <path fill-rule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd" />
        </svg>
        <span class="font-normal">{{ vcViews() | number }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterMetaComponent {
  vcViews = input<number>(0);
  vcDate = input<string | number | Date | null | undefined>(undefined);
  customClass = input<string>('');

  readonly formattedDate = computed(() => formatDateOnly(this.vcDate()));
}
