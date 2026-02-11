import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Novel } from '../../../../interfaces/novel.interface';

@Component({
  selector: 'app-novel-latest-home',
  standalone: true,
  imports: [],
  templateUrl: './novel-latest-home.component.html',
  styleUrl: './novel-latest-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NovelLatestHomeComponent {
  novels = input<Novel[]>([]);
}
