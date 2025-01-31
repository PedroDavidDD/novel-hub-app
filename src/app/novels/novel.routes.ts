import { Routes } from "@angular/router";
import { NovelPageComponent } from "./pages/novel-page/novel-page.component";
import { ChapterPageComponent } from "./pages/chapter-page/chapter-page.component";
import { NovelsPageComponent } from "./pages/novels-page/novels-page.component";

export const NOVEL_ROUTES: Routes = [
    {
        path: '',
        component: NovelsPageComponent,
    },
    {
        path: ':title',
        component: NovelPageComponent,
    },
    {
        path: ':title/:chapterId',
        component: ChapterPageComponent,
    },
]