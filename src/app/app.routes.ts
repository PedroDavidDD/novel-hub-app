import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages';
import {
  HomePageComponent,
  } from './features/novels/pages';
import { NovelsLayoutComponent } from './features/novels/layout/novels-layout/novels-layout.component';
import { AuthLayoutComponent } from './features/auth/layout/auth-layout/auth-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { NotAuthenticatedGuard } from './core/guards/notAuthenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canMatch: [NotAuthenticatedGuard],
    canActivateChild: [NotAuthenticatedGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login-page/login-page.component').then(m => m.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
      },
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
      }
    ]
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
    children:
    [
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
