import { Routes } from "@angular/router";
import {
    NovelsPageComponent,
    NovelPageComponent,
    ChapterPageComponent,
} from "./pages";
import { permissionGuard } from "../../core/guards/permission.guard";

/**
 * Rutas de Novels con autorización por permisos
 * 
 * Sistema de permisos:
 * - novels.create: Crear nuevas novelas
 * - novels.read: Ver lista de novelas
 * - novels.edit: Editar novelas
 * - novels.delete: Eliminar novelas
 * - chapters.create: Crear capítulos
 * - chapters.read: Leer capítulos
 * - chapters.edit: Editar capítulos
 * - chapters.delete: Eliminar capítulos
 */
export const NOVELS_ROUTES: Routes = [
    {
        path: '',
        component: NovelsPageComponent,
        // Solo usuarios con novels.read pueden ver la lista
        canActivate: [permissionGuard('novels.read')]
    },
    {
        path: ':title',
        component: NovelPageComponent,
        canActivate: [permissionGuard('novels.read')]
    },
    {
        path: ':title/:chapterId',
        component: ChapterPageComponent,
        canActivate: [permissionGuard('chapters.read')]
    },
    {
        path: '**',
        redirectTo: '',
    },
];
