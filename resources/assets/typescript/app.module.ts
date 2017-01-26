import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './app.routing';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { HomeComponent } from "./components/home/home.component";
import { ProgressBar } from "./components/ui/progress-bar/progress-bar.component";
import { HeaderComponent } from "./components/header/header.component";
import { SideBarComponent } from "./components/sidebar/sidebar.component";
import { FileUploadService } from "./services/file-upload/file-upload.service";
import { LiftComponent } from "./components/lift/lift.component";
import { CustomerTable } from "./components/cTable/cTable.component";
import { LoginComponent } from "./components/login/login.component";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { AuthService } from "./services/auth/auth.service";
import { HttpService } from "./services/http/http.service";
import { LoginGuard, NotLoggedGuard } from "./services/login-guard/login-guard.service";
import { PaginationComponent } from "./components/pagination/pagination.component";
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
        PaginationComponent
    ],
    providers: [
        FileUploadService,
        LoginGuard,
        AuthService,
        NotLoggedGuard,
        HttpService
    ],
    bootstrap:[
        AppComponent
    ]
})
export class AppModule {}
