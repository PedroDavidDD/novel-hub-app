import { Routes } from "@angular/router";
import {
    NovelsPageComponent,
    NovelPageComponent,
    ChapterPageComponent,
} from "./pages";

export const NOVEL_ROUTES: Routes = [
    {
        path: '',
        component: NovelsPageComponent,
        children: [
            { path: ':title', component: NovelPageComponent },
            { path: ':title/:chapterId', component: ChapterPageComponent },
            { path: '**', redirectTo: 'list' },
        ]
    },
]