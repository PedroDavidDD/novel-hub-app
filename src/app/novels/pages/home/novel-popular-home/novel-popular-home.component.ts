import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { INovel } from '../../../services/novels.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-novel-popular-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './novel-popular-home.component.html',
  styleUrl: './novel-popular-home.component.css'
})
export class NovelPopularHomeComponent {
  @Input() novels:any= [];

}
