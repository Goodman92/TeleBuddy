import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
    selector: 'login',
    'template': require('./login.component.html')
})

export class LoginComponent {
    constructor(private authService: AuthService, private router: Router) {
    }

    onSubmit(email: HTMLInputElement, password: HTMLInputElement) {
        //validointi
        this.authService.login(email.value, password.value).subscribe((result) => {
            console.log(result);
            if (result) {
                this.router.navigate(['home']);
                console.log(result);
            }
        }, (err) => {
            console.log("errori! " + err);
        });
    }

}