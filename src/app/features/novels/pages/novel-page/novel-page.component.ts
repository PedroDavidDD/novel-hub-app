import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { NovelsService, INovel, IChapterItem } from '../../services/novels.service';
import { ReadingHistoryService, IReadingProgress } from '../../services/reading-history.service';
import { CustomButtonComponent, CustomBadgeComponent, ChapterMetaComponent, TagSecondaryComponent } from '../../../../shared/components';
import { CardShineDirective } from '../../../../shared/directives/card-shine.directive';
import { NOVEL_PAGE_TEXTS, resolveNovelStatusUI } from './constants/novel-page.constants';
import { NovelDescriptionSectionComponent } from './components/novel-description-section/novel-description-section.component';

type ChapterFilterTab = 'free' | 'premium' | 'images';

@Component({
  selector: 'app-novel-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CustomButtonComponent,
    CustomBadgeComponent,
    CardShineDirective,
    NovelDescriptionSectionComponent,
    ChapterMetaComponent,
    TagSecondaryComponent,
  ],
  templateUrl: './novel-page.component.html',
  styleUrls: ['./novel-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full min-w-0',
  },
})
export class NovelPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly novelsService = inject(NovelsService);
  private readonly readingHistoryService = inject(ReadingHistoryService);
  private readonly titleService = inject(Title);
  private readonly destroy$ = new Subject<void>();

  readonly texts = NOVEL_PAGE_TEXTS;

  readonly novel = signal<INovel | undefined>(undefined);
  readonly chapters = signal<IChapterItem[]>([]);
  readonly readingProgress = signal<IReadingProgress | null>(null);
  readonly isNovelLoading = signal<boolean>(true);
  readonly isChaptersLoading = signal<boolean>(true);
  readonly isImageLoaded = signal<boolean>(false);
  readonly activeTab = signal<ChapterFilterTab>('free');

  readonly novelStatusConfig = computed(() => resolveNovelStatusUI(this.novel()?.status));
  readonly readChaptersSet = computed(() => new Set(this.readingProgress()?.readChapters || []));
  readonly lastReadChapterNumber = computed(() => this.readingProgress()?.lastChapterNumber ?? null);
  readonly mainTags = computed(() => this.novel()?.genres || []);
  readonly secondaryTags = computed(() => this.novel()?.tags || []);

  readonly freeChaptersCount = computed(() => {
    return this.chapters().filter(c => !c.isPremium).length;
  });

  readonly premiumChaptersCount = computed(() => {
    return this.chapters().filter(c => c.isPremium).length;
  });

  readonly imageChapters = computed(() => {
    return this.chapters().filter(c => !!c.imageUrl);
  });

  readonly filteredChapters = computed(() => {
    const list = this.chapters();
    const tab = this.activeTab();
    if (tab === 'free') {
      return list.filter(c => !c.isPremium);
    }
    if (tab === 'premium') {
      return list.filter(c => c.isPremium);
    }
    return list;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slugOrTitle = params.get('slug') || params.get('title');
      if (slugOrTitle) {
        this.loadNovel(slugOrTitle);
      } else {
        this.isNovelLoading.set(false);
        this.isChaptersLoading.set(false);
      }
    });
  }

  loadNovel(slugOrTitle: string): void {
    this.isNovelLoading.set(true);
    this.isChaptersLoading.set(true);
    this.isImageLoaded.set(false);

    this.novelsService.getNovelById(slugOrTitle).subscribe({
      next: (novel) => {
        this.novel.set(novel);
        this.isNovelLoading.set(false);

        if (novel) {
          this.titleService.setTitle(`${novel.title} - Novel Hub`);

          if (novel.id) {
            this.readingHistoryService.getProgressByNovelId(novel.id).subscribe({
              next: (p) => this.readingProgress.set(p),
              error: () => this.readingProgress.set(null),
            });
          }

          this.novelsService.getChaptersByNovel(novel.slug || novel.id).subscribe({
            next: (chaptersList) => {
              this.chapters.set(chaptersList);
              this.isChaptersLoading.set(false);
            },
            error: () => {
              this.isChaptersLoading.set(false);
            }
          });
        } else {
          this.isChaptersLoading.set(false);
        }
      },
      error: () => {
        this.isNovelLoading.set(false);
        this.isChaptersLoading.set(false);
      }
    });
  }

  onImageLoad(): void {
    this.isImageLoaded.set(true);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/novel1.jpg';
    }
    this.isImageLoaded.set(true);
  }

  setTab(tab: ChapterFilterTab): void {
    this.activeTab.set(tab);
  }

  onGenreClick(genre: string): void {
    this.router.navigate(['/series'], { queryParams: { genre } });
  }

  onTagClick(tag: string): void {
    this.router.navigate(['/series'], { queryParams: { tag } });
  }

  onFirstChapter(): void {
    const n = this.novel();
    const list = this.chapters();
    if (!n) return;
    const targetChapter = list.length > 0 ? list[0].chapterNumber : 0;
    this.router.navigate(['/novel', n.slug || n.id, 'chapter', targetChapter]);
  }

  isChapterRead(chapterNumber: number): boolean {
    return this.readChaptersSet().has(chapterNumber);
  }

  onLastReadChapter(): void {
    const n = this.novel();
    const list = this.chapters();
    if (!n) return;

    const lastRead = this.lastReadChapterNumber();
    if (typeof lastRead === 'number' && lastRead > 0) {
      this.router.navigate(['/novel', n.slug || n.id, 'chapter', lastRead]);
      return;
    }

    const targetChapter = list.length > 0 ? list[0].chapterNumber : 0;
    this.router.navigate(['/novel', n.slug || n.id, 'chapter', targetChapter]);
  }

  onChapterClick(chapter: IChapterItem): void {
    const n = this.novel();
    if (!n) return;
    this.router.navigate(['/novel', n.slug || n.id, 'chapter', chapter.chapterNumber]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
