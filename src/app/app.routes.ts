import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { NovelsPageComponent } from './novels/pages/novels-page/novels-page.component';
import { LayoutPageComponent } from './novels/pages/layout-page/layout-page.component';
import { HomePageComponent } from './novels/pages/home-page/home-page.component';

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
      { path: 'novels', component: NovelsPageComponent },
      {
        path: 'novel',
        loadChildren: () => import('./novels/novel.routes').then(m => m.NOVEL_ROUTES),
      },
      { path: '404', component: Error404PageComponent },
      { path: '**', redirectTo: '404' }
    ]
  }
  ];
