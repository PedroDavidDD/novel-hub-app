import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagComponent } from '../../components/tag/tag.component';

@Component({
  selector: 'app-novel-page',
  standalone: true,
  imports: [TagComponent],
  templateUrl: './novel-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NovelPageComponent {
  title = input.required<string>();
  image = input<string>('');
  description = input<string>('');
  genres = input<string[]>([]);
  tags = input<string[]>([]);
  associatedNames = input<string[]>([]);
}
