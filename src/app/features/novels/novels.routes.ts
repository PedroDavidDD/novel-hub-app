import { Routes } from "@angular/router";
import {
    NovelsPageComponent,
    NovelPageComponent,
    ChapterPageComponent,
} from "./pages";

export const NOVELS_ROUTES: Routes = [
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
    {
        path: '**',
        redirectTo: '',
    },
];