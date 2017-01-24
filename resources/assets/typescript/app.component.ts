import { Component, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from './services/sharedservice/shared.service';
import { AuthService } from './services/auth/auth.service';

@Component({
    'selector': 'app',
    'template': `
    	<side-bar *ngIf="authService.isLoggedIn()"></side-bar>
    	<div id="wrapper" #wrapper>   
            <top-header *ngIf="authService.isLoggedIn()"></top-header>
    	    <router-outlet></router-outlet>
        </div>
    `,
    providers: [SharedService]
})
export class AppComponent {
    @ViewChild('wrapper') el:ElementRef

    constructor(private sharedService: SharedService, private authService: AuthService) {
        
        // this.sharedService.announceMission();
        this.sharedService.missionAnnounced$.subscribe(() => {
            let margin = this.el.nativeElement.style.marginLeft;
            this.el.nativeElement.style.marginLeft = margin == '5em' ? '17em' : '5em';
        });


        console.log("LOGGED IN ? : " + this.authService.isLoggedIn());

    }
}