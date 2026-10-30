import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdBannerComponent {
  @Input() slotId: string = 'chapter-top';
  @Input() label: string = 'ADVERTISEMENT';
  @Input() imageUrl?: string;
  @Input() linkUrl?: string;
  @Input() placeholderText: string = 'Espacio publicitario disponible';
  @Input() maxHeight: string = '280px';
}
