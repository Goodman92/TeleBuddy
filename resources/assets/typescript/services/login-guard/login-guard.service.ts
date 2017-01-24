import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/Router';
import { AuthService } from '../auth/auth.service';

@Injectable()

export class LoginGuard implements CanActivate {
    constructor(private auth: AuthService) { }

    public canActivate() {
        return this.auth.isLoggedIn();
    }
}

@Injectable()

export class NotLoggedGuard implements CanActivate {
    constructor(private auth: AuthService) { }

    public canActivate() {
        return !this.auth.isLoggedIn();
    }
}

