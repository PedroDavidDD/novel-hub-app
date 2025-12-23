import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ads-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ads-carousel.component.html',
  styleUrl: './ads-carousel.component.css'
})
export class AdsCarouselComponent {
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() carousel: boolean = true;

  @HostBinding('class.horizontal')
  get isHorizontal() { return this.direction === 'horizontal'; }

  @HostBinding('class.vertical')
  get isVertical() { return this.direction === 'vertical'; }

  @HostBinding('class.carousel')
  get isCarousel() { return this.carousel; }
}
