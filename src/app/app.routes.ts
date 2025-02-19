import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages';
import { 
  LayoutPageComponent,
  NovelsPageComponent,
  HomePageComponent,
 } from './features/novels/pages';

export const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: 
    [
      {
        path: '',
        component: HomePageComponent,
      },
      { path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
      },

      { path: 'novels', component: NovelsPageComponent },
      {
        path: 'novel',
        loadChildren: () => import('./features/novels/novel.routes').then(m => m.NOVEL_ROUTES),
      },

      { path: '404', component: Error404PageComponent },
      { path: '**', redirectTo: '404' }
    ]
  }
  ];
