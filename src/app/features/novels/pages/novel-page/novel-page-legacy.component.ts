import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NovelsService, INovel } from '../../services/novels.service';
import { CustomButtonComponent, CustomBadgeComponent } from '../../../../shared/components';

/**
 * @deprecated Preserved previous novel page design for instant rollback if requested.
 */
@Component({
  selector: 'app-novel-page-legacy',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent, CustomBadgeComponent],
  templateUrl: './novel-page-legacy.component.html',
  styleUrls: ['./novel-page-legacy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NovelPageLegacyComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly novelsService = inject(NovelsService);
  private readonly destroy$ = new Subject<void>();

  novel = signal<INovel | undefined>(undefined);
  isLoading = signal<boolean>(true);

  get title(): string {
    return this.novel()?.title || '';
  }

  get image(): string {
    return this.novel()?.image || '';
  }

  get description(): string {
    return this.novel()?.description || '';
  }

  get genres(): string[] {
    return this.novel()?.genres || [];
  }

  get tags(): string[] {
    return this.novel()?.tags || [];
  }

  get status(): string {
    return this.novel()?.status || 'Ongoing';
  }

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const slugOrTitle = params.get('slug') || params.get('title');
      if (slugOrTitle) {
        this.isLoading.set(true);
        this.novelsService.getNovelById(slugOrTitle).subscribe({
          next: (novel) => {
            this.novel.set(novel);
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          }
        });
      } else {
        this.isLoading.set(false);
      }
    });
  }

  onGenreClick(genre: string): void {
    this.router.navigate(['/series'], { queryParams: { genre } });
  }

  onAddToLibrary(): void {
    // Legacy action
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
