import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CardShineDirective } from '../../../../../../shared/directives/card-shine.directive';

@Component({
  selector: 'app-novel-popular-home',
  standalone: true,
  imports: [CardShineDirective],
  templateUrl: './novel-popular-home.component.html',
  styleUrl: './novel-popular-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NovelPopularHomeComponent {
  private readonly router = inject(Router);
  novels = input<any[]>([]);

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/novel1.jpg';
    }
  }

  navigateToNovel(novel: any): void {
    const slug = novel.slug || novel.title;
    this.router.navigate(['/novel', slug]);
  }
}
