import { Routes } from "@angular/router";
import { Error404PageComponent } from "../../shared/pages";
import {
    LoginPageComponent,
    RegisterPageComponent,
    ProfilePageComponent,
    SettingsPageComponent
} from "./pages";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                component: LoginPageComponent,
            },
            {
                path: 'register',
                component: RegisterPageComponent,
            },
            {
                path: 'profile',
                component: ProfilePageComponent,
            },
            {
                path: 'settings',
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
]
