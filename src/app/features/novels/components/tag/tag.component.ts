import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tag',
  standalone: true,
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  label = input.required<string>();
}