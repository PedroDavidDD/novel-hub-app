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
import { CustomButtonComponent, AdBannerComponent } from '../../../../shared/components';

@Component({
  selector: 'app-chapter-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CustomButtonComponent, AdBannerComponent],
  templateUrl: './chapter-page.component.html',
  styleUrl: './chapter-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChapterPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly novelsService = inject(NovelsService);
  private readonly titleService = inject(Title);
  private readonly destroy$ = new Subject<void>();

  readonly novel = signal<INovel | undefined>(undefined);
  readonly currentChapter = signal<IChapterItem | undefined>(undefined);
  readonly allChapters = signal<IChapterItem[]>([]);
  readonly isLoading = signal<boolean>(true);

  readonly currentChapterIndex = computed(() => {
    const current = this.currentChapter();
    if (!current) return -1;
    return this.allChapters().findIndex(c => c.chapterNumber === current.chapterNumber);
  });

  readonly hasPreviousChapter = computed(() => {
    return this.currentChapterIndex() > 0;
  });

  readonly hasNextChapter = computed(() => {
    const idx = this.currentChapterIndex();
    const list = this.allChapters();
    return idx >= 0 && idx < list.length - 1;
  });

  readonly previousChapterNumber = computed(() => {
    const idx = this.currentChapterIndex();
    if (idx > 0) {
      return this.allChapters()[idx - 1].chapterNumber;
    }
    return null;
  });

  readonly nextChapterNumber = computed(() => {
    const idx = this.currentChapterIndex();
    const list = this.allChapters();
    if (idx >= 0 && idx < list.length - 1) {
      return list[idx + 1].chapterNumber;
    }
    return null;
  });

  readonly estimatedWords = computed(() => {
    const ch = this.currentChapter();
    if (!ch || !ch.content) return 1818;
    const words = ch.content.trim().split(/\s+/).length;
    return words > 40 ? words : 1818;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slugOrTitle = params.get('slug') || params.get('title') || '';
      const chapterNumStr = params.get('chapterNumber') || params.get('chapterId') || '0';
      const chapterNum = parseInt(chapterNumStr, 10);

      this.loadChapter(slugOrTitle, isNaN(chapterNum) ? 0 : chapterNum);
    });
  }

  loadChapter(slugOrTitle: string, chapterNum: number): void {
    this.isLoading.set(true);
    this.novelsService.getNovelById(slugOrTitle).subscribe({
      next: (novel) => {
        this.novel.set(novel);
        if (novel) {
          this.novelsService.getChaptersByNovel(novel.slug || novel.id).subscribe({
            next: (chapters) => {
              this.allChapters.set(chapters);
              const found = chapters.find(c => c.chapterNumber === chapterNum) || chapters[0];
              this.currentChapter.set(found);

              // Set browser document title as requested
              const chTitle = found ? (found.title.includes(':') ? found.title : `Chapter ${found.chapterNumber}: ${found.title}`) : `Chapter ${chapterNum}`;
              this.titleService.setTitle(`${novel.title} - ${chTitle} - Novel Hub`);
              this.isLoading.set(false);
            },
            error: () => {
              this.isLoading.set(false);
            }
          });
        } else {
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  goToPreviousChapter(): void {
    const prev = this.previousChapterNumber();
    if (prev !== null) {
      this.goToChapter(prev);
    }
  }

  goToNextChapter(): void {
    const next = this.nextChapterNumber();
    if (next !== null) {
      this.goToChapter(next);
    }
  }

  goToChapter(num: number): void {
    const n = this.novel();
    if (!n) return;
    this.router.navigate(['/novel', n.slug || n.id, 'chapter', num]);
  }

  onChapterSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const num = parseInt(target.value, 10);
    if (!isNaN(num)) {
      this.goToChapter(num);
    }
  }

  goToNovel(): void {
    const n = this.novel();
    if (!n) return;
    this.router.navigate(['/novel', n.slug || n.id]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
