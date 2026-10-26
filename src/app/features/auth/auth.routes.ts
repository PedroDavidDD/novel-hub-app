import { Routes } from '@angular/router';
import { Error404PageComponent } from '../../shared/pages';
import {
  LoginPageComponent,
  RegisterPageComponent,
  ProfilePageComponent,
  SettingsPageComponent
} from './pages';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { authGuard } from '../../core/guards/auth.guard';
import { notAuthenticatedGuard } from '../../core/guards/notAuthenticated.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        canActivate: [notAuthenticatedGuard],
        component: LoginPageComponent,
      },
      {
        path: 'register',
        canActivate: [notAuthenticatedGuard],
        component: RegisterPageComponent,
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        component: ProfilePageComponent,
      },
      {
        path: 'settings',
        canActivate: [authGuard],
        component: SettingsPageComponent,
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
    ]
  },
  { path: '404', component: Error404PageComponent },
  { path: '**', redirectTo: '404' }
];
