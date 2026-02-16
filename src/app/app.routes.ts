import { Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages';
import { 
  HomePageComponent,
 } from './features/novels/pages';
import { NovelsLayoutComponent } from './features/novels/layout/novels-layout/novels-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { NotAuthenticatedGuard } from './core/guards/notAuthenticated.guard';
import { UserRole } from './core/models/user.model';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page/register-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    canMatch: [NotAuthenticatedGuard],
    canActivateChild: [NotAuthenticatedGuard], 
    children: [
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'register',
        component: RegisterPageComponent
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
        data: { roles: [UserRole.USER_HOME] }
      },
      {
        path: 'novels',
        loadChildren: () => import('./features/novels/novels.routes').then(m => m.NOVELS_ROUTES),
        data: { roles: [UserRole.USER_NOVELS] }
      },
    ]
  },
  { path: '404', component: Error404PageComponent },
  { path: '**', redirectTo: '404' }
];
