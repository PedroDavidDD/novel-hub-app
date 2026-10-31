import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBadgeComponent } from '../../../../../../shared/components/custom-badge/custom-badge.component';
import { ReleaseDayBadgeComponent } from '../../../../../../shared/components/release-day-badge/release-day-badge.component';
import { INovel, INovelCategory } from '../../../../services/novels.service';
import { NOVEL_PAGE_TEXTS, NovelStatusUI } from '../../constants/novel-page.constants';

@Component({
  selector: 'app-novel-description-section',
  standalone: true,
  imports: [CommonModule, CustomBadgeComponent, ReleaseDayBadgeComponent],
  templateUrl: './novel-description-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full min-w-0',
  },
})
export class NovelDescriptionSectionComponent {
  novel = input<INovel | undefined>(undefined);
  novelStatusConfig = input<NovelStatusUI | undefined>(undefined);

  genreClick = output<string>();

  readonly texts = NOVEL_PAGE_TEXTS;
  readonly isDescriptionExpanded = signal<boolean>(false);

  readonly mainCategories = computed<INovelCategory[]>(() => {
    const categories = this.novel()?.categories;
    if (categories && categories.length > 0) {
      return categories.filter(c => c.status === 1);
    }
    return (this.novel()?.genres || []).map(name => ({ name, status: 1 as const }));
  });

  readonly secondaryCategories = computed<INovelCategory[]>(() => {
    const categories = this.novel()?.categories;
    if (categories && categories.length > 0) {
      return categories.filter(c => c.status === 2);
    }
    return (this.novel()?.tags || []).map(name => ({ name, status: 2 as const }));
  });

  toggleDescription(): void {
    this.isDescriptionExpanded.update(v => !v);
  }

  onGenreClick(genre: string): void {
    this.genreClick.emit(genre);
  }
}
