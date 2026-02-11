import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Novel } from '../../../../interfaces/novel.interface';

@Component({
  selector: 'app-novel-popular-home',
  standalone: true,
  imports: [],
  templateUrl: './novel-popular-home.component.html',
  styleUrl: './novel-popular-home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NovelPopularHomeComponent {
  novels = input<Novel[]>([]);
}
