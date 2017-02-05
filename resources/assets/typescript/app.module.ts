import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routing';

//Components
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from "./components/General/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/Homepage/home/home.component";
import { ProgressBar } from "./components/General/ui/progress-bar/progress-bar.component";
import { HeaderComponent } from "./components/General/header/header.component";
import { SideBarComponent } from "./components/General/sidebar/sidebar.component";
import { LiftComponent } from "./components/Homepage/lift/lift.component";
import { CustomerTable } from "./components/Homepage/home-maincomponent/home-main.component";
import { LoginComponent } from "./components/Loginpage/login/login.component";
import { DropdownComponent } from "./components/Homepage/dropdown/dropdown.component";
import { PaginationComponent } from "./components/General/pagination/pagination.component";
import { CustomerHomeComponent } from "./components/Customerspage/customer-home/customer-home.component";
import { UsersHomeComponent } from "./components/Userspage/users-home/users-home.component"; 

//Services 
import { AuthService } from "./services/auth/auth.service";
import { HttpService } from "./services/http/http.service";
import { FileUploadService } from "./services/file-upload/file-upload.service";
import { LoginGuard, NotLoggedGuard } from "./services/login-guard/login-guard.service";

//Pluginit


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ],
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        HomeComponent,
        ProgressBar,
        HeaderComponent,
        SideBarComponent,
        LiftComponent,
        CustomerTable,
        LoginComponent,
        DropdownComponent,
        PaginationComponent,
        CustomerHomeComponent,
        UsersHomeComponent
    ],
    providers: [
        FileUploadService,
        LoginGuard,
        AuthService,
        NotLoggedGuard,
        HttpService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
