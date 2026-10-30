import { Routes } from '@angular/router';
import { NovelPageComponent, ChapterPageComponent } from './pages';

export const SINGLE_NOVEL_ROUTES: Routes = [
  {
    path: ':slug',
    component: NovelPageComponent,
  },
  {
    path: ':slug/chapter/:chapterNumber',
    component: ChapterPageComponent,
  },
  {
    path: ':slug/:chapterId',
    component: ChapterPageComponent,
  },
];
