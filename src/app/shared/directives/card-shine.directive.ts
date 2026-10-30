import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appCardShine]',
  standalone: true,
})
export class CardShineDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  @Input() shineEnabled: boolean = true;
  @Input() zoomScale: number = 1.05;

  private shineEl?: HTMLElement;
  private imageEl?: HTMLImageElement | null;
  private gradientOverlayEl?: HTMLElement;

  ngOnInit(): void {
    const host = this.el.nativeElement;

    // Ensure host is relatively positioned and clips overflow
    if (getComputedStyle(host).position === 'static') {
      this.renderer.setStyle(host, 'position', 'relative');
    }
    this.renderer.setStyle(host, 'overflow', 'hidden');

    // Create the diagonal shine element
    this.shineEl = this.renderer.createElement('div');
    this.renderer.addClass(this.shineEl, 'app-card-shine-glare');
    this.renderer.setStyle(this.shineEl, 'position', 'absolute');
    this.renderer.setStyle(this.shineEl, 'top', '0');
    this.renderer.setStyle(this.shineEl, 'left', '-150%');
    this.renderer.setStyle(this.shineEl, 'width', '80%');
    this.renderer.setStyle(this.shineEl, 'height', '100%');
    this.renderer.setStyle(
      this.shineEl,
      'background',
      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.28) 50%, transparent 100%)'
    );
    this.renderer.setStyle(this.shineEl, 'transform', 'skewX(-25deg)');
    this.renderer.setStyle(this.shineEl, 'pointer-events', 'none');
    this.renderer.setStyle(this.shineEl, 'z-index', '30');
    this.renderer.setStyle(this.shineEl, 'opacity', '0');

    this.renderer.appendChild(host, this.shineEl);

    // Create subtle bottom gradient overlay if not already present
    this.gradientOverlayEl = this.renderer.createElement('div');
    this.renderer.addClass(this.gradientOverlayEl, 'app-card-gradient-overlay');
    this.renderer.setStyle(this.gradientOverlayEl, 'position', 'absolute');
    this.renderer.setStyle(this.gradientOverlayEl, 'inset', '0');
    this.renderer.setStyle(
      this.gradientOverlayEl,
      'background',
      'linear-gradient(to top, rgba(0, 0, 0, 0.1) 0%, transparent 90%)'
    );
    this.renderer.setStyle(this.gradientOverlayEl, 'pointer-events', 'none');
    this.renderer.setStyle(this.gradientOverlayEl, 'z-index', '10');
    this.renderer.setStyle(this.gradientOverlayEl, 'transition', 'opacity 0.4s ease');
    this.renderer.setStyle(this.gradientOverlayEl, 'opacity', '0');

    this.renderer.appendChild(host, this.gradientOverlayEl);
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.shineEnabled) return;

    // 1. Smooth image zoom
    this.findImage();
    if (this.imageEl) {
      this.renderer.setStyle(this.imageEl, 'transition', 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)');
      this.renderer.setStyle(this.imageEl, 'transform', `scale(${this.zoomScale})`);
    }

    // 2. Reveal overlay gradient
    if (this.gradientOverlayEl) {
      this.renderer.setStyle(this.gradientOverlayEl, 'opacity', '1');
    }

    // 3. Diagonal shine sweep from left to right (enter only)
    if (this.shineEl && typeof this.shineEl.animate === 'function') {
      this.shineEl.animate(
        [
          { left: '-120%', opacity: 0 },
          { left: '20%', opacity: 0.9 },
          { left: '160%', opacity: 0 }
        ],
        {
          duration: 750,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'none'
        }
      );
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    // 1. Restore image zoom smoothly
    if (this.imageEl) {
      this.renderer.setStyle(this.imageEl, 'transform', 'scale(1)');
    }

    // 2. Hide overlay gradient
    if (this.gradientOverlayEl) {
      this.renderer.setStyle(this.gradientOverlayEl, 'opacity', '0');
    }

    // Notice: Shine does NOT trigger on leave, maintaining strictly enter-only behavior
  }

  private findImage(): void {
    if (!this.imageEl) {
      this.imageEl = this.el.nativeElement.querySelector('img');
    }
  }
}
