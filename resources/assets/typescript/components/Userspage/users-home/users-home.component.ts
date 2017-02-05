import { Component, ReflectiveInjector, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from "../../../services/http/http.service";
import { ClientModel } from "../../../interfaces/basemodel.interface";

@Component({
  selector: 'users-home',
 // styleUrls: ['header.component.scss'],
  template: require('./users-home.component.html')
})

export class UsersHomeComponent {

  constructor(private httpService: HttpService) {

   }
}
