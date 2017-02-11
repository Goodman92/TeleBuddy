import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from "../../../services/http/http.service";
import { Observable } from "Rxjs";
import { CustomCompanyModel } from "../../../interfaces/basemodel.interface";
import { ListModel } from "../../../interfaces/basemodel.interface";
import { AjaxModel } from "./interface.ajaxconf";
import { PagiConfiguration } from "../../General/pagination/pagination.interface";
import { CityModel, DetailsStorage, ExtendedStorage, BsnsModel, IDetails } from "./home.models";

// ei es6 toteutusta
import fileSaver = require("file-saver");

@Component({
  'selector': 'customer-table',
  'template': require('./home-main.component.html')
})

export class CustomerTable {
  @ViewChild('visibilitiesSelect') visibilitiesRef: ElementRef;
  @ViewChild('sizeSelect') sizeRef: ElementRef;

  private cityStorage: DetailsStorage;
  private linesStorage: ExtendedStorage;
  private ajaxConf: AjaxModel;

  private companies: Array<any> = new Array();
  public shownPages: number = 0;
  public loading: boolean = true;
  private parameterFlag: boolean = false;
  public limiter: number = 25;
  public size: number = 0;
  public count: number = 5;

  private defaultSelector: string = "Kaikki";


  constructor(private httpService: HttpService) {
    this.ajaxConf = new AjaxModel(1000, 1000, 1000, 1500, 25, 0);
    this.cityStorage = new DetailsStorage();
    this.linesStorage = new ExtendedStorage();
  }

  private getData(lowerbound: number, upperbound: number) {
    let ids = this.linesStorage.getCorrespondingIDs();

    if (this.parameterFlag)
      return this.httpService
        .post('/api/customers/custom/' + lowerbound + '/' + upperbound, new CustomCompanyModel(ids, this.cityStorage.getModified(), null))
    return this.httpService
      .get('api/customers/clients/' + lowerbound + '/' + upperbound);
  }


  public removeElement(value: IDetails, collection: DetailsStorage): void {
    collection.findOrFail(value);
  }

  public linesUpdated(val) {
    this.updateStorage(val, this.linesStorage);
  }

  public citiesUpdated(val) {
    this.updateStorage(val, this.cityStorage);
  }

  private updateStorage(value: string, storage: DetailsStorage) {
    if (value == this.defaultSelector) {
      storage.resetModified();
    }
    else {
      storage.findAndInsert(value);
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
    this.loading = true;
    let ids = this.linesStorage.getCorrespondingIDs();
    this.parameterFlag = (this.linesStorage.isModifiedEmpty() && this.cityStorage.isModifiedEmpty()) ? true : false;

    this.httpService
      .post('/api/customers/custom/0/1500', new CustomCompanyModel(ids, this.cityStorage.getModified(), null))
      .subscribe((result) => {
        this.companies = result.companies;
        this.size = result.active;
        this.loading = false;
      });

  }

  public generateList() {
    let visibilities = this.visibilitiesRef.nativeElement.value;
    let size = this.sizeRef.nativeElement.value;
    let ids = this.linesStorage.getCorrespondingIDs();

    this.httpService
      .post('/api/customers/generate', new ListModel(size, visibilities, ids, this.cityStorage.getModified(), null))
      .subscribe((result) => {
        let blob = new Blob([result.data], { type: 'text/xml' });
        let url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, 'Yrityslistaus.xml');
      });
  }

  ngOnInit() {
    Observable.forkJoin(
      this.httpService.get('api/customers/cities'),
      this.httpService.get('api/customers/lines'),
      this.httpService.get('api/customers/clients/' + this.ajaxConf.reserve + '/' + this.ajaxConf.collectionSize)
    ).subscribe((result) => {
      for (let entry of result[0].cities) {
        this.cityStorage.insert(new CityModel(entry.city));
      }
      for (let entry of result[1].lines) {
        this.linesStorage.insert(new BsnsModel(entry));
      }
      this.companies = result[2].companies;
      this.size = result[2].active;
      this.loading = false;

    });
  }

} 
