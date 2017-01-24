import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

import { HttpService } from '../http/http.service';
import { LoginModel } from '../../interfaces/basemodel.interface';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  private loggedIn = false;

  constructor(private http: Http, private router: Router, private httpService: HttpService) {
    if (localStorage.getItem('auth_token')) {
      this.httpService
        .get('/api/login/user')
        .subscribe((result) => {
          if (result.login) {
            this.loggedIn = true;
            this.router.navigate(['home']);
          }
        }, (err) => {
          console.log("error on return api/login/user");
        });
    } else {
      this.loggedIn = false;
    }
  }
 
  login(email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.httpService
      .post('/api/login', new LoginModel(email, password))
      .map((res) => {
        if (res.token) {
          localStorage.setItem('auth_token', res.token);
          this.loggedIn = true;
        }
        return res.token;
      });
  } 

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
