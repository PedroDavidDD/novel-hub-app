import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomBadgeComponent } from '../../../../../../shared/components/custom-badge/custom-badge.component';
import { ReleaseDayBadgeComponent } from '../../../../../../shared/components/release-day-badge/release-day-badge.component';
import { TagSecondaryComponent } from '../../../../../../shared/components/tag-secondary/tag-secondary.component';
import { INovel } from '../../../../services/novels.service';
import { NOVEL_PAGE_TEXTS, NovelStatusUI, resolveWeeklySchedule, ScheduleDayItem } from '../../constants/novel-page.constants';

@Component({
  selector: 'app-novel-description-section',
  standalone: true,
  imports: [CommonModule, CustomBadgeComponent, ReleaseDayBadgeComponent, TagSecondaryComponent],
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
  tagClick = output<string>();

  readonly texts = NOVEL_PAGE_TEXTS;
  readonly isDescriptionExpanded = signal<boolean>(false);

  readonly genres = computed<string[]>(() => {
    return this.novel()?.genres || [];
  });

  readonly tags = computed<string[]>(() => {
    return this.novel()?.tags || [];
  });

  // Aliases retrocompatibles para templates y tests
  readonly mainTags = computed<{ name: string; status: number }[]>(() => {
    return this.genres().map(g => ({ name: g, status: 1 }));
  });
  readonly secondaryTags = computed<{ name: string; status: number }[]>(() => {
    return this.tags().map(t => ({ name: t, status: 2 }));
  });
  readonly mainCategories = this.mainTags;
  readonly secondaryCategories = this.secondaryTags;

  readonly weeklySchedule = computed<ScheduleDayItem[]>(() => {
    return resolveWeeklySchedule(this.novel()?.releaseSchedule?.days);
  });

  toggleDescription(): void {
    this.isDescriptionExpanded.update(v => !v);
  }

  onGenreClick(genre: string): void {
    this.genreClick.emit(genre);
  }

  onTagClick(tag: string): void {
    this.tagClick.emit(tag);
  }
}
