import { Component, ReflectiveInjector, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from "../../../services/http/http.service";
import { ClientModel } from "../../../interfaces/basemodel.interface";
import { Observable, Subscription } from "rxjs/Rx";

@Component({
  selector: 'customer-home',
  // styleUrls: ['header.component.scss'],
  template: require('./customer-home.component.html')
})

export class CustomerHomeComponent {
  private hideClass: string = "hide";
  private trigger: boolean = true;
  private companies: Array<any>;
  private deletedClients: Array<any> = new Array<any>();

  public limiter: number = 10;
  public size: number = 100000;
  public count: number = 5;
  public shownPages: number = 0;

  private businessId: string = " ";
  private success: boolean = false;
  private failed: boolean = false;

  constructor(private httpService: HttpService) {
    this.companies = new Array<any>();

    this.httpService.get('/api/clients').subscribe((result) => {
      if (result.companies) {
        this.companies = result.companies;
        this.size = result.companies.length;
      }
    });
  }

  private showForm(): void {
    console.log(this.trigger);
    this.trigger = !this.trigger;
  }

  public pageChanged(value) {
    value = parseInt(value);
    this.shownPages = value - this.limiter;
  }

  private removeClient(index): void {
    console.log(index);
    this.deletedClients.push(this.companies[index]);
    this.companies.splice(index, 1);
  }

  private confirmDelete(): void {
    console.log(this.deletedClients);
    this.httpService.post('/api/clients/delete', new ClientModel(this.deletedClients)).subscribe((result) => {
      this.deletedClients = [];
    });
  }

  private onKey(event: any) {
    this.businessId = event.target.value;
  }

  private addClient() {
    this.httpService.get('/api/clients/add/' + this.businessId).subscribe((result) => {
      this.companies = result.companies;
      this.toggleAlert(true,false);
    }, (error) => {
      this.toggleAlert(false,true);
    });
  }

  private hideAlert() {
    this.success = false;
    this.failed = false;
  }

  private toggleAlert(suc: boolean, fail: boolean) {
    this.success = suc;
    this.failed = fail;
  }

}
