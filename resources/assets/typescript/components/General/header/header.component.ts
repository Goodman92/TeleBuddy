import { Component, ReflectiveInjector, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../services/sharedservice/shared.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'top-header',
 // styleUrls: ['header.component.scss'],
  template: require('./header.component.html')
})

export class HeaderComponent {
  @ViewChild('header') el:ElementRef
  constructor(private sharedService: SharedService, private authService: AuthService, private router: Router) { }

  toggleSideBar(): void {
  	this.sharedService.announceMission();
  }

  public logOut(): void {
    console.log("LOG OUT");
    this.authService.logout();
    this.router.navigate(['']);
  }

}
