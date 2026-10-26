import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages';
import { HomePageComponent } from './features/novels/pages';
import { NovelsLayoutComponent } from './features/novels/layout/novels-layout/novels-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'account',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./features/account/account.routes').then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: NovelsLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'home',
        component: HomePageComponent,
        data: { permissions: ['home.read'] }
      },
      {
        path: 'novels',
        loadChildren: () => import('./features/novels/novels.routes').then(m => m.NOVELS_ROUTES),
        data: { permissions: ['novels.read'] }
      },
    ]
  },
  { path: '404', component: Error404PageComponent },
  { path: '**', redirectTo: '404' }
];
