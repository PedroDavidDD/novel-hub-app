import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages';
import { 
  NovelsPageComponent,
  HomePageComponent,
 } from './features/novels/pages';
import { NovelsLayoutComponent } from './features/novels/layout/novels-layout/novels-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/user.model';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '',
    component: NovelsLayoutComponent,
    canActivate: [authGuard],
    children: 
    [
      {
        path: 'home',
        component: HomePageComponent,
        data: { roles: [UserRole.USER_HOME] } // Solo accesible por USER_HOME y ADMIN
      },
      {
        path: 'novels',
        loadChildren: () => import('./features/novels/novels.routes').then(m => m.NOVELS_ROUTES),
        data: { roles: [UserRole.USER_NOVELS] } // Solo accesible por USER_NOVELS y ADMIN
      },
    ]
  },
  { path: '404', component: Error404PageComponent },
  { path: '**', redirectTo: '404' }
];
