import { Routes } from "@angular/router";
import {
    NovelsPageComponent,
    NovelPageComponent,
    ChapterPageComponent,
} from "./pages";
import { permissionGuard } from "../../core/guards/permission.guard";

export const NOVELS_ROUTES: Routes = [
    {
        path: '',
        component: NovelsPageComponent,
        canActivate: [permissionGuard('novels.read')]
    },
    {
        path: ':slug',
        component: NovelPageComponent,
        canActivate: [permissionGuard('novels.read')]
    },
    {
        path: ':slug/chapter/:chapterNumber',
        component: ChapterPageComponent,
        canActivate: [permissionGuard('chapters.read')]
    },
    {
        path: ':slug/:chapterId',
        component: ChapterPageComponent,
        canActivate: [permissionGuard('chapters.read')]
    },
    {
        path: '**',
        redirectTo: '',
    },
];
