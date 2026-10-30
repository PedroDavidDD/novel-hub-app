import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { INovel, NovelsService } from '../../services/novels.service';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { CardShineDirective } from '../../../../shared/directives/card-shine.directive';
import { SortOption } from '../../interfaces/novel.interface';

const ANY_FILTER = 'Any';

const SORT_STRATEGIES: Record<SortOption, (a: INovel, b: INovel) => number> = {
  Name: (a, b) => a.title.localeCompare(b.title),
  Popular: (a, b) => b.popularity - a.popularity,
  Chapters: (a, b) => (Number(Array.isArray(b.chapters) ? b.chapters.length : (b.chapters ?? 0))) - (Number(Array.isArray(a.chapters) ? a.chapters.length : (a.chapters ?? 0))),
  New: (a, b) => new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime(),
  Rating: (a, b) => b.rating - a.rating,
};

@Component({
  selector: 'app-novels-page',
  standalone: true,
  imports: [TruncatePipe, CardShineDirective],
  templateUrl: './novels-page.component.html',
  styleUrls: ['./novels-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovelsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly novelsService = inject(NovelsService);

  readonly languages: string[] = ['Any', 'English', 'Chinese', 'Korean'];
  readonly statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  readonly sortByOptions: SortOption[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];
  readonly genres: string[] = ['Fantasy', 'Action', 'Harem', 'Adventure', 'Romance', 'Vida moderna', 'Vida escolar', 'Drama'];

  readonly selectedLanguage = signal<string>(ANY_FILTER);
  readonly selectedStatus = signal<string>(ANY_FILTER);
  readonly selectedSort = signal<SortOption>('Name');
  readonly selectedGenres = signal<string[]>([]);

  readonly filteredNovels = computed(() => {
    const allNovels = this.novelsService.novels();
    const filtered = allNovels.filter(novel => this.shouldShowNovel(novel));
    return this.sortNovels(filtered);
  });

  ngOnInit(): void {
    this.novelsService.getAllNovels().subscribe();
  }

  filterByLanguage(language: string): void {
    this.selectedLanguage.set(language);
  }

  filterByStatus(status: string): void {
    this.selectedStatus.set(status);
  }

  sortBy(option: SortOption): void {
    this.selectedSort.set(option);
  }

  onGenreChange(genre: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.selectedGenres.update(currentGenres => {
      if (isChecked) {
        return [...currentGenres, genre];
      } else {
        return currentGenres.filter(g => g !== genre);
      }
    });
  }

  navigateToNovel(novel: INovel): void {
    this.router.navigate(['/novel', novel.slug || novel.title]);
  }

  private shouldShowNovel(novel: INovel): boolean {
    const matchesLanguage = 
      this.selectedLanguage() === ANY_FILTER || 
      novel.language === this.selectedLanguage();

    const matchesStatus = 
      this.selectedStatus() === ANY_FILTER || 
      novel.status === this.selectedStatus();

    const currentGenres = this.selectedGenres();
    const matchesGenres = 
      currentGenres.length === 0 || 
      currentGenres.some(genre => novel.genres.includes(genre));

    return matchesLanguage && matchesStatus && matchesGenres;
  }

  private sortNovels(novels: INovel[]): INovel[] {
    const sortStrategy = SORT_STRATEGIES[this.selectedSort()];
    return sortStrategy ? [...novels].sort(sortStrategy) : novels;
  }
}
