import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-novel-latest-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novel-latest-home.component.html',
  styleUrl: './novel-latest-home.component.css'
})
export class NovelLatestHomeComponent {
  @Input() novels: any = [];

}
