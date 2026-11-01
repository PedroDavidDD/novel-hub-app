import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly novelsService = inject(NovelsService);

  readonly languages: string[] = ['Any', 'English', 'Chinese', 'Korean'];
  readonly statuses: string[] = ['Any', 'Ongoing', 'Completed', 'Hiatus'];
  readonly sortByOptions: SortOption[] = ['Name', 'Popular', 'Chapters', 'New', 'Rating'];

  readonly selectedLanguage = signal<string>(ANY_FILTER);
  readonly selectedStatus = signal<string>(ANY_FILTER);
  readonly selectedSort = signal<SortOption>('Name');
  readonly selectedTags = signal<string[]>([]);

  // Alias para retrocompatibilidad
  readonly selectedGenres = this.selectedTags;

  readonly availableTags = computed<string[]>(() => {
    const allNovels = this.novelsService.novels();
    const tagSet = new Set<string>();

    allNovels.forEach(novel => {
      novel.tags?.forEach(tag => {
        if (tag.name && tag.status !== 0) {
          tagSet.add(tag.name.trim());
        }
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

  onTagChange(tag: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.selectedTags.update(currentTags => {
      const updated = isChecked
        ? [...currentTags, tag]
        : currentTags.filter(t => t.toLowerCase() !== tag.toLowerCase());
      this.updateQueryParams(updated);
      return updated;
    });
  }

  // Alias para retrocompatibilidad
  onGenreChange(tag: string, event: Event): void {
    this.onTagChange(tag, event);
  }

  navigateToNovel(novel: INovel): void {
    this.router.navigate(['/novel', novel.slug || novel.title]);
  }

  /**
   * Sincroniza y autoselecciona los tags a partir de los queryParams de la URL.
   */
  syncFiltersFromQueryParams(params: Params): void {
    const tagParam = params['tag'];

    if (!tagParam) {
      this.selectedTags.set([]);
      return;
    }

    const rawList = Array.isArray(tagParam) ? tagParam : String(tagParam).split(',');
    const parsedTags = rawList
      .map(t => String(t).trim())
      .filter(t => t.length > 0);

    this.selectedTags.set(parsedTags);
  }

  private initQueryParamsListener(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => this.syncFiltersFromQueryParams(params));
  }

  private updateQueryParams(tags: string[]): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tag: tags.length > 0 ? tags.join(',') : null },
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

    const currentTags = this.selectedTags();
    const matchesTags = 
      currentTags.length === 0 || 
      currentTags.some(selectedTag => 
        novel.tags?.some(t => 
          t.name.trim().toLowerCase() === selectedTag.trim().toLowerCase() && 
          t.status !== 0
        )
      );

    return matchesLanguage && matchesStatus && matchesTags;
  }

  private sortNovels(novels: INovel[]): INovel[] {
    const sortStrategy = SORT_STRATEGIES[this.selectedSort()];
    return sortStrategy ? [...novels].sort(sortStrategy) : novels;
  }
}
