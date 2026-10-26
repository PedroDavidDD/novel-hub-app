import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NovelsService, INovel } from '../../services/novels.service';
import { CustomButtonComponent, CustomBadgeComponent } from '../../../../shared/components';

@Component({
  selector: 'app-novel-page',
  standalone: true,
  imports: [CommonModule, CustomButtonComponent, CustomBadgeComponent],
  templateUrl: './novel-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NovelPageComponent implements OnInit {
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
      const title = params.get('title');
      if (title) {
        this.isLoading.set(true);
        this.novelsService.getNovelById(title).subscribe({
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
    this.router.navigate(['/novels'], { queryParams: { genre } });
  }

  onAddToLibrary(): void {
    // Manejador para agregar novela a la biblioteca del usuario
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
