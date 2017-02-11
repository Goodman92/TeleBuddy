import { Component, ReflectiveInjector, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from "../../../services/http/http.service";
import { ClientModel } from "../../../interfaces/basemodel.interface";
import { Observable, Subscription } from "rxjs/Rx";
import { State } from "./state.enum";

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
  private state: State = State.UNKNOWN;

  public limiter: number = 10;
  public size: number = 0;
  public count: number = 5;
  public shownPages: number = 0;

  private businessId: string = "";

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
    this.trigger = !this.trigger;
  }

  public pageChanged(value) {
    this.shownPages = parseInt(value) - this.limiter;
  }

  private removeClient(index): void {
    this.deletedClients.push(this.companies[index]);
    this.companies.splice(index, 1);
  }

  private confirmDelete(): void {
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
      this.toggleAlert(State.SUCCESS);
    }, (error) => {
      this.toggleAlert(State.FAILED);
    });
  }

  private hideAlert() {
    this.state = State.UNKNOWN;
  }

  private toggleAlert(status: State) {
    this.state = status;
  }
}
