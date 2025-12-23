import { Routes } from "@angular/router";
import { Error404PageComponent } from "../../shared/pages";
import {
    LoginPageComponent,
    RegisterPageComponent,
    ProfilePageComponent,
    SettingsPageComponent
} from "./pages";

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
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

    { path: '404', component: Error404PageComponent },
    { path: '**', redirectTo: '404' }
]
