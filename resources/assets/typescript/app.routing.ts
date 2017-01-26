import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { LoginGuard, NotLoggedGuard } from './services/login-guard/login-guard.service';
export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [LoginGuard]
    },
    {
        path: '',
        component: LoginComponent,
        canActivate: [NotLoggedGuard]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];
