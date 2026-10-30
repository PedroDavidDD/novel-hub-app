import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  // Inputs con Signals (Angular 19)
  readonly title = input<string>('Modal');
  readonly show = input<boolean>(false);
  readonly isStatic = input<boolean>(true);
  readonly showCloseButton = input<boolean>(true);
  readonly maxWidth = input<string>('max-w-lg');

  // Outputs para notificación desacoplada
  readonly close = output<void>();
  readonly onClose = output<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.show() && !this.isStatic()) {
      event.preventDefault();
      this.closeModal();
    }
  }

  onBackdropClick(): void {
    if (!this.isStatic()) {
      this.closeModal();
    }
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  closeModal(): void {
    this.close.emit();
    this.onClose.emit();
  }
}
