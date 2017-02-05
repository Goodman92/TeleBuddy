import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from "./components/General/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/Homepage/home/home.component";
import { LoginComponent } from "./components/Loginpage/login/login.component";
import { LoginGuard, NotLoggedGuard } from './services/login-guard/login-guard.service';
import { CustomerHomeComponent } from "./components/Customerspage/customer-home/customer-home.component";
import { UsersHomeComponent } from "./components/Userspage/users-home/users-home.component";
export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [LoginGuard]
    },
    {
        path: 'customers',
        component: CustomerHomeComponent,
        canActivate: [LoginGuard]
    },
    {
        path: 'users',
        component: UsersHomeComponent,
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
