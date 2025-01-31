import { Component, Input } from '@angular/core';
import { TagComponent } from '../../components/tag/tag.component';

@Component({
  selector: 'app-novel-page',
  standalone: true,
  imports: [TagComponent],
  templateUrl: './novel-page.component.html',
})
export class NovelPageComponent {
  @Input() title!: string;
  @Input() image!: string;
  @Input() description!: string;
  @Input() genres!: string[];
  @Input() tags!: string[];
  @Input() associatedNames!: string[];

}
