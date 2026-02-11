import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages';
import { 
  NovelsPageComponent,
  HomePageComponent,
 } from './features/novels/pages';
import { NovelsLayoutComponent } from './features/novels/layout/novels-layout/novels-layout.component';

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
    children: 
    [
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'novels',
        loadChildren: () => import('./features/novels/novels.routes').then(m => m.NOVELS_ROUTES),
      },
    ]
  },
  { path: '404', component: Error404PageComponent },
  { path: '**', redirectTo: '404' }
];
