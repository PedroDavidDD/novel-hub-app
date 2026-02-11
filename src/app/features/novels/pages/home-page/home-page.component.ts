import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { INovel, NovelsService } from '../../services/novels.service';
import { NovelLatestHomeComponent } from './components/novel-latest-home/novel-latest-home.component';
import { NovelPopularHomeComponent } from './components/novel-popular-home/novel-popular-home.component';

const LATEST_NOVELS_LIMIT = 12;
const POPULAR_NOVELS_LIMIT = 6;

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NovelLatestHomeComponent,
    NovelPopularHomeComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private readonly novelsService = inject(NovelsService);

  readonly latestNovels = computed(() => {
    const novels = this.novelsService.novels();
    return this.applyLatestFilter(novels).slice(0, LATEST_NOVELS_LIMIT);
  });

  readonly popularNovels = computed(() => {
    const novels = this.novelsService.novels();
    return this.applyPopularFilter(novels).slice(0, POPULAR_NOVELS_LIMIT);
  });

  private applyLatestFilter(novels: INovel[]): INovel[] {
    return novels
      .filter(novel => novel.releaseDate)
      .sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return dateB.getTime() - dateA.getTime();
      });
  }

  private applyPopularFilter(novels: INovel[]): INovel[] {
    return [...novels].sort((a, b) => b.popularity - a.popularity);
  }
}
