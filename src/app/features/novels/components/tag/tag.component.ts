import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag',
  standalone: true,
  templateUrl: './tag.component.html',
})
export class TagComponent {
  @Input() label!: string;
}
