import { Routes } from "@angular/router";
import { Error404PageComponent } from "../../shared/pages";
import { 
    LoginPageComponent, 
    RegisterPageComponent,
 } from "./pages";

export const AUTH_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'login',
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'register',
        component: RegisterPageComponent,
    },

    { path: '404', component: Error404PageComponent },
    { path: '**', redirectTo: '404' }
]