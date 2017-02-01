import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from "../../../services/http/http.service";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import { Observable } from "Rxjs";
import { CustomCompanyModel } from "../../../interfaces/basemodel.interface";
import { ListModel } from "../../../interfaces/basemodel.interface";

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
  private companyForms: Array<any> = new Array();
  public cities: Array<string> = new Array();
  public addedLines: Array<any> = new Array();
  public addedCities: Array<string> = new Array();
  public addedForms: Array<any> = new Array();
  private companies: Array<any> = new Array();
  public shownPages: number = 0;
  public loading: boolean = true;

  private parameterFlag: boolean = false;

  // Pagination komponentin konffit, voi muuttaa
  public limiter: number = 25;
  public size: number = 100000;
  public count: number = 5;

  // Ajax pagination ko nffit
  private buffer: number = 1000;
  private leftBuffer: number = 1000;
  private bufferSize: number = 1000;
  private collectionSize: number = 1500;
  private currentPosition: number = 25;
  private reserve: number = 0;
  public right: number = 0;
  public left: number = 0;
  private ceil: number = 0;

  private defaultSelector: string = "Kaikki";

  constructor(private httpService: HttpService) {
    // roskaa  fixiä
    Observable.forkJoin(
      this.httpService.get('api/customers/cities'),
      this.httpService.get('api/customers/lines'),
      this.httpService.get('api/customers/clients/' + this.reserve + '/' + this.collectionSize)
    ).subscribe((result) => {

      for(let entry of result[0].cities) {
          this.cities.push(entry);
      }
      for(let entry of result[1].lines) {
          this.businessLines.push(entry);
      }

      this.companies = result[2].companies;
      this.size = result[2].active;
      this.loading = false;
    });

    this.companyForms = [
      { name: "AOY", checked: false },
      { name: "OYJ", checked: false },
      { name: "OY", checked: false },
      { name: "OK", checked: false },
      { name: "VOJ", checked: false }
    ];
  }

  private getData(lowerbound: number, upperbound: number) {
    if (this.parameterFlag)
      return this.httpService
        .post('/api/customers/custom/' + lowerbound + '/' + upperbound, new CustomCompanyModel(this.getCorrespondingLineIds(), this.addedCities, this.addedForms))
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

  // pagination ajax, haetaan kerralla max 1500 tulosta kannasta. konffit ylhäällä .
  public pageChanged(value) {
    console.log(value);
    value = parseInt(value);
    if (value < this.currentPosition) {

      if (value - this.leftBuffer <= 0) {
        this.buffer = this.leftBuffer;
        let lowerbound = this.leftBuffer - this.bufferSize < 0 ? 0 : this.leftBuffer - this.collectionSize;

        this.getData(lowerbound, this.bufferSize + this.right).mergeMap((result) => {
          if (result.companies) {
            this.companies.splice((this.bufferSize / 2) - this.right, this.bufferSize + this.right);
            this.companies = result.companies.concat(this.companies);
            this.reserve -= this.bufferSize + this.right;
            this.shownPages = this.shownPages + this.bufferSize + this.right;
            this.right = 0;
            this.left = (this.bufferSize / 2);
            if (this.reserve < 0) {
              this.reserve = this.left = 0;
            }
            return "";
          }
        }).subscribe();
        this.leftBuffer -= this.bufferSize;
      }
    }
    else {
      if (value >= this.buffer) {
        this.leftBuffer = this.buffer;
        let lowerbound = this.buffer + (this.bufferSize / 2) - this.left;

        this.getData(lowerbound, this.bufferSize + this.left).mergeMap((result) => {

          if (this.ceil < result.testi) {
            this.companies.splice(0, this.bufferSize + this.left);
            this.companies = this.companies.concat(result.companies);
          }
          this.reserve += this.bufferSize + this.left;
          this.shownPages = this.currentPosition - this.reserve - this.limiter - this.left;
          this.right = (this.bufferSize / 2);
          this.left = 0;
          // reserven upperl imitti
          console.log("valmi s. sP " + this.shownPages);
          console.log("ceili: " + result.testi);
          this.ceil = result.testi;
          return "";
        }).subscribe();

        this.buffer += this.bufferSize;
      }
    }

    this.currentPosition = value;
    this.shownPages = value - this.limiter - this.reserve;
  }

  public fetchResults() {
    this.parameterFlag = true;
    this.loading = true;
    this.companyFormSpecified();
    
    if (this.addedLines.length == 0 && this.addedCities.length == 0 && this.addedForms.length == 0)
      this.parameterFlag = false;

    this.httpService
      .post('/api/customers/custom/0/1500', new CustomCompanyModel(this.getCorrespondingLineIds(), this.addedCities, this.addedForms))
      .subscribe((result) => {
        if (result.companies) {
          this.companies = result.companies;
          this.size = result.active;
        }
        this.loading = false;
      });

  }

  public addCompanyform(value) {
    value.checked = !value.checked;
  }

  private companyFormSpecified() {
    this.addedForms = [ ];
    for (let i = 0; i < this.companyForms.length; i++) {
      if (this.companyForms[i].checked && this.companyForms[i].name != this.defaultSelector)
        this.addedForms.push(this.companyForms[i].name);
    }
  }

  public generateList() {

    let visibilities = this.visibilitiesRef.nativeElement.value;
    let size = this.sizeRef.nativeElement.value;
    this.companyFormSpecified();
    this.httpService
      .post('/api/customers/generate', new ListModel(size, visibilities, this.getCorrespondingLineIds(), this.addedCities, this.addedForms))
      .subscribe((result) => {
        /*
        let blob = new Blob([result._body], { type: 'text/xml'});
        let url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, 'Yrityslistaus.xml');
        */
      });
  }

  private getCorrespondingLineIds() {
    let ids: Array<number> = new Array();
    for(let i = 0; i < this.addedLines.length; i++) {
        ids.push(this.addedLines[i].id);
    }
    return ids;
  }
} 