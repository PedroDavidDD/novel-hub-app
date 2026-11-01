import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, TruncatePipe, CardShineDirective],
  templateUrl: './novels-page.component.html',
  styleUrls: ['./novels-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NovelsPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly novelsService = inject(NovelsService);

  readonly languages: string[] = ['Any', 'English', 'Chinese', 'Korean'];
  readonly statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  readonly sortByOptions: SortOption[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];

  readonly selectedLanguage = signal<string>(ANY_FILTER);
  readonly selectedStatus = signal<string>(ANY_FILTER);
  readonly selectedSort = signal<SortOption>('Name');

  readonly selectedGenres = signal<string[]>([]);
  readonly selectedTags = signal<string[]>([]);

  readonly availableGenres = computed<string[]>(() => {
    const allNovels = this.novelsService.novels();
    const genreSet = new Set<string>();

    allNovels.forEach(novel => {
      novel.genres?.forEach(genre => {
        if (genre) genreSet.add(genre.trim());
      });
    });

    return Array.from(genreSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  });

  readonly availableTags = computed<string[]>(() => {
    const allNovels = this.novelsService.novels();
    const tagSet = new Set<string>();

    allNovels.forEach(novel => {
      novel.tags?.forEach(tag => {
        if (tag) tagSet.add(tag.trim());
      });
    });

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  });

  readonly filteredNovels = computed(() => {
    const allNovels = this.novelsService.novels();
    const filtered = allNovels.filter(novel => this.shouldShowNovel(novel));
    return this.sortNovels(filtered);
  });

  ngOnInit(): void {
    this.novelsService.getAllNovels().subscribe();
    this.initQueryParamsListener();
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

  toggleGenre(genre: string): void {
    this.selectedGenres.update(current => {
      const exists = current.some(g => g.toLowerCase() === genre.toLowerCase());
      const updated = exists
        ? current.filter(g => g.toLowerCase() !== genre.toLowerCase())
        : [...current, genre];
      this.updateQueryParams(updated, this.selectedTags());
      return updated;
    });
  }

  toggleTag(tag: string): void {
    this.selectedTags.update(current => {
      const exists = current.some(t => t.toLowerCase() === tag.toLowerCase());
      const updated = exists
        ? current.filter(t => t.toLowerCase() !== tag.toLowerCase())
        : [...current, tag];
      this.updateQueryParams(this.selectedGenres(), updated);
      return updated;
    });
  }

  // Alias para retrocompatibilidad
  onTagChange(tag: string, event: Event): void {
    this.toggleTag(tag);
  }

  onGenreChange(genre: string, event: Event): void {
    this.toggleGenre(genre);
  }

  navigateToNovel(novel: INovel): void {
    this.router.navigate(['/novel', novel.slug || novel.title]);
  }

  /**
   * Sincroniza y autoselecciona los filtros a partir de los queryParams de la URL.
   */
  syncFiltersFromQueryParams(params: Params): void {
    const genreParam = params['genre'];
    if (genreParam) {
      const rawList = Array.isArray(genreParam) ? genreParam : String(genreParam).split(',');
      this.selectedGenres.set(rawList.map(g => String(g).trim()).filter(Boolean));
    } else {
      this.selectedGenres.set([]);
    }

    const tagParam = params['tag'];
    if (tagParam) {
      const rawList = Array.isArray(tagParam) ? tagParam : String(tagParam).split(',');
      this.selectedTags.set(rawList.map(t => String(t).trim()).filter(Boolean));
    } else {
      this.selectedTags.set([]);
    }
  }

  private initQueryParamsListener(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.syncFiltersFromQueryParams(params));
  }

  private updateQueryParams(genres: string[], tags: string[]): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        genre: genres.length > 0 ? genres.join(',') : null,
        tag: tags.length > 0 ? tags.join(',') : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private shouldShowNovel(novel: INovel): boolean {
    const matchesLanguage = 
      this.selectedLanguage() === ANY_FILTER || 
      novel.language === this.selectedLanguage();

    const matchesStatus = 
      this.selectedStatus() === ANY_FILTER || 
      novel.status === this.selectedStatus();

    const curGenres = this.selectedGenres();
    const matchesGenres = 
      curGenres.length === 0 || 
      curGenres.some(sg => 
        (novel.genres || []).some(g => g.trim().toLowerCase() === sg.trim().toLowerCase())
      );

    const curTags = this.selectedTags();
    const matchesTags = 
      curTags.length === 0 || 
      curTags.some(st => 
        (novel.tags || []).some(t => t.trim().toLowerCase() === st.trim().toLowerCase())
      );

    return matchesLanguage && matchesStatus && matchesGenres && matchesTags;
  }

  private sortNovels(novels: INovel[]): INovel[] {
    const sortStrategy = SORT_STRATEGIES[this.selectedSort()];
    return sortStrategy ? [...novels].sort(sortStrategy) : novels;
  }
}
