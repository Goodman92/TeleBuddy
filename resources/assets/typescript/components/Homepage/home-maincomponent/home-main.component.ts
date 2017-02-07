import { Component, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpService } from "../../../services/http/http.service";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "Rxjs";
import { CustomCompanyModel } from "../../../interfaces/basemodel.interface";
import { ListModel } from "../../../interfaces/basemodel.interface";
import { AjaxModel } from "./interface.ajaxconf";

// ei es6 toteutusta
import fileSaver = require("file-saver");

@Component({
  'selector': 'customer-table',
  'template': require('./home-main.component.html')
})

export class CustomerTable {
  @ViewChild('visibilitiesSelect') visibilitiesRef: ElementRef;
  @ViewChild('sizeSelect') sizeRef: ElementRef;

  public businessLines: Array<string> = new Array();
  public cities: Array<string> = new Array();
  public addedLines: Array<any> = new Array();
  public addedCities: Array<string> = new Array();
  private companies: Array<any> = new Array();
  public shownPages: number = 0;
  public loading: boolean = true;

  private parameterFlag: boolean = false;

  // Pagination komponentin konffit, voi muuttaa, tee modeli 
  public limiter: number = 25;
  public size: number = 100000;
  public count: number = 5;

  // Ajax pagination konffit
  private ajaxConf: AjaxModel;

  private defaultSelector: string = "Kaikki";


  constructor(private httpService: HttpService, private zone: NgZone) {
    this.ajaxConf = new AjaxModel(1000, 1000, 1000, 1500, 25, 0);
    // roskaa  fixiä
    Observable.forkJoin(
      this.httpService.get('api/customers/cities'),
      this.httpService.get('api/customers/lines'),
      this.httpService.get('api/customers/clients/' + this.ajaxConf.reserve + '/' + this.ajaxConf.collectionSize)
    ).subscribe((result) => {

      for (let entry of result[0].cities) {
        this.cities.push(entry);
      }
      for (let entry of result[1].lines) {
        this.businessLines.push(entry);
      }

      this.companies = result[2].companies;
      this.size = result[2].active;
      this.loading = false;

    });

  }

  private getData(lowerbound: number, upperbound: number) {
    if (this.parameterFlag)
      return this.httpService
        .post('/api/customers/custom/' + lowerbound + '/' + upperbound, new CustomCompanyModel(this.getCorrespondingLineIds(), this.addedCities, null))
    return this.httpService
      .get('api/customers/clients/' + lowerbound + '/' + upperbound);
  }


  public removeElement(value: string, collection: Array<string>): void {
    var index = collection.indexOf(value);
    if (index > -1) {
      collection.splice(index, 1);
    }
  }

  public linesUpdated(val) {
    if (val == this.defaultSelector) {
      this.addedLines = [];
    }
    else {
      let element: any = this.businessLines.find((obj: any) => {
        return obj.name == val;
      });
      this.addedLines.push(element);
    }
  }

  public citiesUpdated(val) {
    if (val == this.defaultSelector) {
      this.addedCities = [];
    }
    else {
      let element: any = this.cities.find((obj: any) => {
        return obj.city == val;
      });
      this.addedCities.push(element.city);
    }
  }

  public onChange(value) {
    this.limiter = parseInt(value.target.value);
  }

  // pagination ajax, haetaan kerralla max 1500 tulosta kannasta. konffit ylhäällä.
  public pageChanged(value) {
    console.log(value);
    value = parseInt(value);
    if (this.ajaxConf.currentPosition >= this.ajaxConf.bufferSize) {

      if (value < this.ajaxConf.currentPosition) {
        if (value <= this.ajaxConf.leftBuffer) {
          this.ajaxConf.buffer = this.ajaxConf.leftBuffer;
          let lowerbound = this.ajaxConf.leftBuffer - this.ajaxConf.bufferSize;

          this.getData(lowerbound, this.ajaxConf.bufferSize / 2).mergeMap((result) => {
            this.companies.splice(this.ajaxConf.bufferSize, this.ajaxConf.bufferSize / 2);
            this.companies = result.companies.concat(this.companies);
            this.ajaxConf.reserve -= this.ajaxConf.bufferSize / 2;
            this.shownPages = this.ajaxConf.currentPosition - this.ajaxConf.reserve - this.limiter;
            return "";
          }).subscribe();
          this.ajaxConf.leftBuffer -= this.ajaxConf.bufferSize / 2;
        }
      }
      else {
        if (value >= this.ajaxConf.buffer) {
          this.ajaxConf.leftBuffer = this.ajaxConf.buffer;
          let lowerbound = this.ajaxConf.buffer + this.ajaxConf.bufferSize / 2;

          this.getData(lowerbound, this.ajaxConf.bufferSize / 2).mergeMap((result) => {
            this.companies.splice(0, this.ajaxConf.bufferSize / 2);
            this.companies = this.companies.concat(result.companies);
            this.ajaxConf.reserve += this.ajaxConf.bufferSize / 2;
            this.shownPages = this.ajaxConf.currentPosition - this.ajaxConf.reserve - this.limiter;
            return "";
          }).subscribe();
          this.ajaxConf.buffer += this.ajaxConf.bufferSize / 2;
        }
      }

    }

    this.ajaxConf.currentPosition = value;
    this.shownPages = value - this.limiter - this.ajaxConf.reserve;
  }

  public fetchResults() {
    this.parameterFlag = true;
    this.loading = true;

    if (this.addedLines.length == 0 && this.addedCities.length == 0)
      this.parameterFlag = false;

    this.httpService
      .post('/api/customers/custom/0/1500', new CustomCompanyModel(this.getCorrespondingLineIds(), this.addedCities, null))
      .subscribe((result) => {
        if (result.companies) {
          this.companies = result.companies;
          this.size = result.active;
        }
        this.loading = false;
      });

  }

  public generateList() {

    let visibilities = this.visibilitiesRef.nativeElement.value;
    let size = this.sizeRef.nativeElement.value;
    this.httpService
      .post('/api/customers/generate', new ListModel(size, visibilities, this.getCorrespondingLineIds(), this.addedCities, null))
      .subscribe((result) => {
        let blob = new Blob([result.data], { type: 'text/xml' });
        let url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, 'Yrityslistaus.xml');
      });
  }

  private getCorrespondingLineIds() {
    let ids: Array<number> = new Array();
    for (let i = 0; i < this.addedLines.length; i++) {
      ids.push(this.addedLines[i].id);
    }
    return ids;
  }
} 
